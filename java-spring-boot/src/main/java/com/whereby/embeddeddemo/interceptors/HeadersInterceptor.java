package com.whereby.embeddeddemo.interceptors;

import lombok.NonNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpRequest;
import org.springframework.http.MediaType;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Collections;

@Component
public class HeadersInterceptor implements ClientHttpRequestInterceptor {

    private static final Logger logger = LoggerFactory.getLogger(HeadersInterceptor.class);

    @Value("${api.key}")
    private String apiKey;

    @Override
    public @NonNull ClientHttpResponse intercept(HttpRequest request, byte @NonNull [] body, @NonNull ClientHttpRequestExecution execution) throws IOException {

        HttpHeaders headers = request.getHeaders();
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        if (apiKey != null) {
            headers.add("Authorization", "Bearer " + apiKey);
        }

        if (HttpMethod.POST.equals(request.getMethod())) {
            headers.add("Content-Type", MediaType.APPLICATION_JSON.toString());
        }

        logger.info("Headers {}", headers);
        return execution.execute(request, body);
    }
}
