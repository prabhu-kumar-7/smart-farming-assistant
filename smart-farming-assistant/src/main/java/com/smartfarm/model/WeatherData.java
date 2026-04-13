package com.smartfarm.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WeatherData {
    private Integer id;
    private Integer farmId;
    private Double temperature;     // Celsius
    private Double humidity;        // %
    private Double rainfall;        // mm (may be 0 if no rain)
    private Double windSpeed;       // km/h
    private String weatherDesc;     // e.g. "clear sky"
    private LocalDateTime fetchedAt;
}