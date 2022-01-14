package com.whereby.embeddeddemo;

import com.whereby.embeddeddemo.interceptors.HeadersInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;

@Configuration
public class RestTemplateConfig {

    @Autowired
    private HeadersInterceptor headersInterceptor;

    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        RestTemplate template = builder.build();
        template.setInterceptors(Collections.singletonList(headersInterceptor));
        return template;
    }
}

