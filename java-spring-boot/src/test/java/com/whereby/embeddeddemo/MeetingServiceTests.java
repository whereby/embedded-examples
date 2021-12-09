package com.whereby.embeddeddemo;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.whereby.embeddeddemo.models.CreateMeetingRequest;
import com.whereby.embeddeddemo.models.Fields;
import com.whereby.embeddeddemo.models.Meeting;
import com.whereby.embeddeddemo.services.MeetingService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.client.ExpectedCount;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.net.URISyntaxException;
import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.*;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withStatus;

@SpringBootTest
@ActiveProfiles("test")
public class MeetingServiceTests {

    @Value("${api.url}")
    String apiUrl;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private MeetingService meetingService;

    @Autowired
    private RestTemplate restTemplate;

    private MockRestServiceServer mockServer;

    @BeforeEach
    public void init() {
        mockServer = MockRestServiceServer.createServer(restTemplate);
    }

    @Test
    public void givenUpstream200_whenGetIsCalled_thenReturnsMockedObject() throws URISyntaxException, JsonProcessingException {

        Meeting m = createMeeting();
        mockServer.expect(ExpectedCount.once(),
                        requestTo(new URI(apiUrl + "/v1/meetings/" + m.getMeetingId())))
                .andExpect(method(HttpMethod.GET))
                .andRespond(withStatus(HttpStatus.OK)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(objectMapper.writeValueAsString(m))
                );

        Optional<Meeting> meeting = meetingService.getMeeting(m.getMeetingId(), null);
        mockServer.verify();

        meeting.map(val -> assertThat(val).isEqualTo(m)).orElseThrow(() -> {
            Assertions.fail("Meeting should not be null");
            return null;
        });
    }

    @Test
    public void givenUpstream200_whenGetIsCalledWithFields_thenReturnsMockedObjectWithFields() throws JsonProcessingException {

        Meeting m = createMeeting();
        URI url = UriComponentsBuilder
                .fromUriString(apiUrl + "/v1/meetings/" + m.getMeetingId())
                .queryParam("fields", Fields.hostRoomUrl)
                .build()
                .toUri();

        mockServer.expect(ExpectedCount.once(), requestTo(url))
                .andExpect(method(HttpMethod.GET))
                .andRespond(withStatus(HttpStatus.OK)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(objectMapper.writeValueAsString(m))
                );

        Optional<Meeting> meeting = meetingService.getMeeting(m.getMeetingId(), Stream.of(Fields.hostRoomUrl).collect(Collectors.toSet()));
        mockServer.verify();

        meeting.map(val -> assertThat(val).isEqualTo(m)).orElseThrow(() -> {
            Assertions.fail("Meeting should not be null");
            return null;
        });
    }

    @Test
    public void givenUpstream404_whenGetIsCalled_thenReturnsNull() throws URISyntaxException, JsonProcessingException {

        String meetingId = "123";
        mockServer.expect(ExpectedCount.once(),
                        requestTo(new URI(apiUrl + "/v1/meetings/" + meetingId)))
                .andExpect(method(HttpMethod.GET))
                .andRespond(withStatus(HttpStatus.NOT_FOUND)
                        .body(objectMapper.writeValueAsString(null))
                );

        Optional<Meeting> meeting = meetingService.getMeeting(meetingId, null);
        mockServer.verify();

        assertThat(meeting.isEmpty()).isTrue();
    }

    @Test
    public void givenUpstream204_whenDeleteIsCalled_thenReturnsTrue() throws URISyntaxException, JsonProcessingException {

        String meetingId = "123";
        mockServer.expect(ExpectedCount.once(),
                        requestTo(new URI(apiUrl + "/v1/meetings/" + meetingId)))
                .andExpect(method(HttpMethod.DELETE))
                .andRespond(withStatus(HttpStatus.NO_CONTENT)
                        .body(objectMapper.writeValueAsString(null))
                );

        boolean found = meetingService.deleteMeeting(meetingId);
        assertThat(found).isTrue();

        mockServer.verify();
    }

    @Test
    public void givenUpstream404_whenDeleteIsCalled_thenReturnsFalse() throws URISyntaxException, JsonProcessingException {

        String meetingId = "123";
        mockServer.expect(ExpectedCount.once(),
                        requestTo(new URI(apiUrl + "/v1/meetings/" + meetingId)))
                .andExpect(method(HttpMethod.DELETE))
                .andRespond(withStatus(HttpStatus.NOT_FOUND)
                        .body(objectMapper.writeValueAsString(null))
                );

        boolean found = meetingService.deleteMeeting(meetingId);
        assertThat(found).isFalse();

        mockServer.verify();
    }

    @Test
    public void givenUpstream201_whenPostIsCalled_thenReturnsMockedObject() throws URISyntaxException, JsonProcessingException {

        Meeting m = createMeeting();
        CreateMeetingRequest req = CreateMeetingRequest.builder().endDate(m.getEndDate()).build();

        mockServer.expect(ExpectedCount.once(),
                        requestTo(new URI(apiUrl + "/v1/meetings")))
                .andExpect(method(HttpMethod.POST))
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().json(objectMapper.writeValueAsString(req)))
                .andRespond(withStatus(HttpStatus.CREATED)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(objectMapper.writeValueAsString(m))
                );

        Meeting meeting = meetingService.createMeeting(req);
        mockServer.verify();

        assertThat(meeting).isEqualTo(m);
    }

    @Test
    public void givenUpstream201_whenPostIsCalledWithFields_thenReturnsMockedObjectWithFields() throws URISyntaxException, JsonProcessingException {

        Meeting m = createMeeting();
        CreateMeetingRequest req = CreateMeetingRequest.builder()
                .endDate(m.getEndDate())
                .fields(Stream.of(Fields.hostRoomUrl).collect(Collectors.toSet()))
                .build();

        mockServer.expect(ExpectedCount.once(),
                        requestTo(new URI(apiUrl + "/v1/meetings")))
                .andExpect(method(HttpMethod.POST))
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().json(objectMapper.writeValueAsString(req)))
                .andRespond(withStatus(HttpStatus.CREATED)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(objectMapper.writeValueAsString(m))
                );

        Meeting meeting = meetingService.createMeeting(req);
        mockServer.verify();

        assertThat(meeting).isEqualTo(m);
    }

    private Meeting createMeeting() {
        OffsetDateTime now = OffsetDateTime.now();
        String meetingId = UUID.randomUUID().toString();

        return Meeting.builder()
                .meetingId(meetingId)
                .startDate(now)
                .endDate(now.plusDays(1))
                .roomUrl("room-url")
                .build();
    }

}
