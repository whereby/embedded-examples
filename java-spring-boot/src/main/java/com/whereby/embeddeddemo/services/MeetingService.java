package com.whereby.embeddeddemo.services;

import com.whereby.embeddeddemo.models.CreateMeetingRequest;
import com.whereby.embeddeddemo.models.Fields;
import com.whereby.embeddeddemo.models.Meeting;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Optional;
import java.util.Set;

@Service
public class MeetingService {

    private static final Logger logger = LoggerFactory.getLogger(MeetingService.class);

    @Autowired
    private RestTemplate restTemplate;

    @Value("${api.url}")
    private String apiUrl;

    public Meeting createMeeting(CreateMeetingRequest body) throws IllegalStateException {
        ResponseEntity<Meeting> response = restTemplate.postForEntity(apiUrl + "/v1/meetings", new HttpEntity<>(body), Meeting.class);
        HttpStatus statusCode = response.getStatusCode();

        if (!HttpStatus.CREATED.equals(statusCode)) {
            logger.error("Error creating meeting [statusCode={}]", statusCode);
            throw new IllegalStateException();
        }

        Meeting meeting = response.getBody();

        if (meeting == null) {
            throw new IllegalStateException();
        }

        return meeting;
    }

    public boolean deleteMeeting(String meetingId) throws IllegalStateException {
        try {
            ResponseEntity<?> response = restTemplate.exchange(apiUrl + "/v1/meetings/" + meetingId, HttpMethod.DELETE, null, String.class);
            HttpStatus statusCode = response.getStatusCode();

            if (!HttpStatus.NO_CONTENT.equals(statusCode)) {
                logger.error("Error deleting meeting [statusCode={}]", statusCode);
                throw new IllegalStateException();
            }

            return true;
        } catch (final HttpClientErrorException e) {
            HttpStatus statusCode = e.getStatusCode();

            if (HttpStatus.NOT_FOUND.equals(statusCode)) {
                return false;
            }

            throw e;
        }
    }

    public Optional<Meeting> getMeeting(String meetingId, @Nullable Set<Fields> fields) throws IllegalStateException {
        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(apiUrl + "/v1/meetings/" + meetingId);

        if (fields != null) {
            builder.queryParam("fields", fields).build().toUriString();
        }

        try {
            ResponseEntity<Meeting> response = restTemplate.getForEntity(builder.build().toUriString(), Meeting.class);
            HttpStatus statusCode = response.getStatusCode();

            if (!HttpStatus.OK.equals(response.getStatusCode())) {
                logger.error("Error fetching meeting [statusCode={}]", statusCode);
                throw new IllegalStateException();
            }

            Meeting meeting = response.getBody();

            if (meeting == null) {
                throw new IllegalStateException();
            }

            return Optional.of(meeting);
        } catch (final HttpClientErrorException e) {
            HttpStatus statusCode = e.getStatusCode();

            if (HttpStatus.NOT_FOUND.equals(statusCode)) {
                return Optional.empty();
            }

            logger.error("Error fetching meeting [statusCode={}]", statusCode);
            throw e;
        }
    }
}
