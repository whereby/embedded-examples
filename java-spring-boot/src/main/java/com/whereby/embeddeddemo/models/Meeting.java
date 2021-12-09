package com.whereby.embeddeddemo.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

import java.time.OffsetDateTime;

@Builder
@Data
@RequiredArgsConstructor
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class Meeting {

    @NonNull
    private final String meetingId;

    @NonNull
    private final String roomUrl;

    @NonNull
    private final OffsetDateTime startDate;

    @NonNull
    private final OffsetDateTime endDate;

    private final String hostRoomUrl;
}

