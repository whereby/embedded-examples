package com.whereby.embeddeddemo.controllers;

import com.whereby.embeddeddemo.models.CreateMeetingRequest;
import com.whereby.embeddeddemo.models.Fields;
import com.whereby.embeddeddemo.models.Meeting;
import com.whereby.embeddeddemo.services.MeetingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("meetings")
public class MeetingController {

    private static final Logger logger = LoggerFactory.getLogger(MeetingController.class);

    @Autowired
    private MeetingService meetingService;

    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<Meeting> createMeeting(@RequestBody CreateMeetingRequest req) throws RuntimeException {

        Meeting meeting = meetingService.createMeeting(req);
        logger.trace("Created meeting: {}", meeting);
        return ResponseEntity.created(getMeetingUrl(meeting.getMeetingId())).body(meeting);
    }

    @RequestMapping(value = "/{meetingId}", method = RequestMethod.DELETE)
    public ResponseEntity<Void> deleteMeeting(@PathVariable String meetingId) throws RuntimeException {

        logger.info("Deleting meeting with id: {}", meetingId);

        boolean found = meetingService.deleteMeeting(meetingId);

        if (!found) {
            return ResponseEntity.notFound().build();
        }

        logger.info("Deleted meeting with id {}", meetingId);
        return ResponseEntity.noContent().build();
    }

    @RequestMapping(value = "/{meetingId}", method = RequestMethod.GET)
    public ResponseEntity<Meeting> getMeeting(@PathVariable String meetingId, @Nullable @RequestParam Set<Fields> fields) throws RuntimeException {

        Optional<Meeting> meeting = meetingService.getMeeting(meetingId, fields);
        return meeting.map(value -> {
            logger.info("Meeting fetched: {}", value);
            return ResponseEntity.ok(value);
        }).orElseGet(() -> {
            logger.info("Meeting not found with id: {}", meetingId);
            return ResponseEntity.notFound().build();
        });
    }

    private URI getMeetingUrl(String meetingId) {

        ServletUriComponentsBuilder builder = ServletUriComponentsBuilder.fromCurrentRequest();
        logger.info("Servlet path {}", builder.build().toUriString());
        return builder.pathSegment(meetingId).build().toUri();
    }
}