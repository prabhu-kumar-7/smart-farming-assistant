package com.smartfarm.controller;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class HealthController {

    // JdbcTemplate injected — used to run a simple DB ping query
    private final JdbcTemplate jdbcTemplate;

    @GetMapping("/api/health")
    public Map<String, String> health() {
        try {
            // Lightweight query to verify DB connection is alive
            jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            return Map.of(
                "status", "UP",
                "database", "NeonDB Connected ✅"
            );
        } catch (Exception e) {
            return Map.of(
                "status", "DOWN",
                "error", e.getMessage()
            );
        }
    }
}