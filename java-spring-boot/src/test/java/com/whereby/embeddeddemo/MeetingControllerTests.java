package com.whereby.embeddeddemo;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.whereby.embeddeddemo.controllers.MeetingController;
import com.whereby.embeddeddemo.models.CreateMeetingRequest;
import com.whereby.embeddeddemo.models.Fields;
import com.whereby.embeddeddemo.models.Meeting;
import com.whereby.embeddeddemo.services.MeetingService;
import org.hamcrest.core.StringEndsWith;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.client.AutoConfigureWebClient;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.RequestBuilder;

import java.time.OffsetDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.within;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(MeetingController.class)
@AutoConfigureWebClient
@ActiveProfiles("test")
class MeetingControllerTests {

    @MockBean
    MeetingService meetingService;

    @Value("${api.url}")
    String apiUrl;

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void givenUpstreamSuccess_whenPostMeetingsIsCalled_thenReturnsMeetingWithStatus201() throws Exception {

        OffsetDateTime now = OffsetDateTime.now();
        OffsetDateTime endDate = now.plusDays(1);

        CreateMeetingRequest body = CreateMeetingRequest.builder()
                .endDate(endDate)
                .isLocked(false)
                .roomNamePattern(CreateMeetingRequest.RoomNamePattern.human_short)
                .roomNamePrefix("test")
                .roomMode(CreateMeetingRequest.RoomMode.group)
                .build();

        String meetingId = UUID.randomUUID().toString();
        String roomUrl = getUrl("/room-url");

        Meeting response = Meeting.builder()
                .meetingId(meetingId)
                .startDate(now)
                .endDate(endDate)
                .roomUrl(roomUrl)
                .build();

        when(meetingService.createMeeting(body)).thenReturn(response);

        RequestBuilder req = buildPostRequest(body);
        MvcResult result = mvc.perform(req)
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", StringEndsWith.endsWith("/meetings/" + meetingId))).andReturn();

        String jsonString = result.getResponse().getContentAsString();
        Meeting meeting = objectMapper.readValue(jsonString, Meeting.class);
        Map<?, ?> meetingRaw = objectMapper.readValue(jsonString, Map.class);

        assertThat(meeting.getMeetingId()).isEqualTo(meetingId);
        assertThat(meeting.getRoomUrl()).isEqualTo(roomUrl);
        assertThat(meeting.getStartDate()).isCloseToUtcNow(within(5, ChronoUnit.SECONDS));
        assertThat(meeting.getEndDate()).isEqualTo(endDate);
        assertThat(meetingRaw.containsKey("hostRoomUrl")).isFalse();

        verify(meetingService).createMeeting(body);
    }

    @Test
    void givenUpstreamSuccess_whenPostMeetingsIsCalledWithFields_thenReturnsMeetingWithFieldsWithStatus201() throws Exception {
        OffsetDateTime now = OffsetDateTime.now();
        OffsetDateTime endDate = now.plusDays(1);

        CreateMeetingRequest body = CreateMeetingRequest.builder()
                .endDate(endDate)
                .fields(Stream.of(Fields.hostRoomUrl).collect(Collectors.toSet()))
                .build();

        String meetingId = UUID.randomUUID().toString();
        String hostRoomUrl = getUrl("/host-room-url");
        String roomUrl = getUrl("/room-url");

        Meeting response = Meeting.builder()
                .meetingId(meetingId)
                .startDate(now)
                .endDate(endDate)
                .hostRoomUrl(hostRoomUrl)
                .roomUrl(roomUrl)
                .build();

        when(meetingService.createMeeting(body)).thenReturn(response);

        RequestBuilder req = buildPostRequest(body);
        MvcResult result = mvc.perform(req)
                .andExpect(status().isCreated())
                .andReturn();

        Meeting meeting = objectMapper.readValue(result.getResponse().getContentAsString(), Meeting.class);
        assertThat(meeting.getHostRoomUrl()).isEqualTo(hostRoomUrl);

        verify(meetingService).createMeeting(body);
    }

    @Test
    public void givenUpstreamSuccess_whenDeleteMeetingIsCalled_thenReturnStatus204() throws Exception {

        String meetingId = "123";
        RequestBuilder req = delete("/meetings/" + meetingId);
        when(meetingService.deleteMeeting(meetingId)).thenReturn(true);

        mvc.perform(req)
                .andExpect(status().isNoContent())
                .andReturn();

        verify(meetingService).deleteMeeting(meetingId);
    }

    @Test
    void givenUpstreamSuccess_whenGetMeetingIsCalled_thenReturnMeetingWithStatus200() throws Exception {

        Meeting meeting = createMeeting();
        RequestBuilder req = get("/meetings/" + meeting.getMeetingId());
        when(meetingService.getMeeting(meeting.getMeetingId(), null)).thenReturn(Optional.of(meeting));
        mvc.perform(req)
                .andExpect(status().isOk())
                .andReturn();

        verify(meetingService).getMeeting(meeting.getMeetingId(), null);
    }

    @Test
    void givenUpstreamSuccess_whenGetMeetingIsCalledWithFields_thenReturnMeetingWithFieldsWithStatus200() throws Exception {

        Meeting meeting = createMeeting();
        Set<Fields> fields = Stream.of(Fields.hostRoomUrl).collect(Collectors.toSet());
        RequestBuilder req = get("/meetings/" + meeting.getMeetingId()).queryParam("fields", Fields.hostRoomUrl.toString());
        when(meetingService.getMeeting(meeting.getMeetingId(), fields)).thenReturn(Optional.of(meeting));
        mvc.perform(req)
                .andExpect(status().isOk())
                .andReturn();

        verify(meetingService).getMeeting(meeting.getMeetingId(), fields);
    }

    private Meeting createMeeting() throws Exception {
        OffsetDateTime now = OffsetDateTime.now();
        OffsetDateTime endDate = now.plusDays(1);

        CreateMeetingRequest body = CreateMeetingRequest.builder()
                .endDate(endDate)
                .build();

        String meetingId = UUID.randomUUID().toString();
        String roomUrl = getUrl("/room-url");

        Meeting response = Meeting.builder()
                .meetingId(meetingId)
                .startDate(now)
                .endDate(endDate)
                .roomUrl(roomUrl)
                .build();

        when(meetingService.createMeeting(body)).thenReturn(response);

        RequestBuilder req = buildPostRequest(body);
        MvcResult result = mvc.perform(req)
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", StringEndsWith.endsWith("/meetings/" + meetingId))).andReturn();

        String jsonString = result.getResponse().getContentAsString();
        return objectMapper.readValue(jsonString, Meeting.class);
    }

    private RequestBuilder buildPostRequest(CreateMeetingRequest body) throws Exception {
        return post("/meetings")
                .header("Content-Type", MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body));
    }

    private String getUrl(String path) {
        return apiUrl + path;
    }
}
