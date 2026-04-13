package com.smartfarm.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    // Shared WebClient bean — reused by WeatherService and ChatService
    @Bean
    public WebClient webClient(WebClient.Builder builder) {
        return builder.build();
    }
}