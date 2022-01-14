package com.whereby.embeddeddemo;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "api")
@Data
public class AppProperties {

    /**
     * Your Whereby API key
     */
    private String key;

    /**
     * The URL of the Whereby API server
     */
    private String url;
}