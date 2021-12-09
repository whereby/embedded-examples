package com.whereby.embeddeddemo.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;

import java.time.OffsetDateTime;
import java.util.Set;

@Builder
@Data
@RequiredArgsConstructor
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class CreateMeetingRequest {

    @NonNull
    final private OffsetDateTime endDate;

    final private RoomMode roomMode;

    final private Set<Fields> fields;

    final private boolean isLocked;

    final private RoomNamePattern roomNamePattern;

    final private String roomNamePrefix;

    public enum RoomMode {
        group, normal
    }

    public enum RoomNamePattern {
        uuid("uuid"),
        human_short("human-short");

        public final String label;

        RoomNamePattern(String value) {
            this.label = value;
        }

        @JsonValue
        public String getLabel() {
            return this.label;
        }
    }
}
