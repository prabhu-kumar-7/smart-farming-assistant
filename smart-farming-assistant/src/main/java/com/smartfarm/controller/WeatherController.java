package com.smartfarm.controller;

import com.smartfarm.model.WeatherData;
import com.smartfarm.service.WeatherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/weather")
@RequiredArgsConstructor
public class WeatherController {

    private final WeatherService weatherService;

    // GET /api/weather/{farmId} — Fetch live weather + save to DB
    @GetMapping("/{farmId}")
    public ResponseEntity<WeatherData> getWeather(@PathVariable Integer farmId) {
        WeatherData data = weatherService.fetchAndSave(farmId);
        return ResponseEntity.ok(data);
    }

    // GET /api/weather/{farmId}/history — Get last 5 weather records
    @GetMapping("/{farmId}/history") 
    public ResponseEntity<List<WeatherData>> getHistory(@PathVariable Integer farmId) {
        return ResponseEntity.ok(weatherService.getWeatherHistory(farmId));
    }
    // GET /api/weather/{farmId}/alerts — Get smart weather alerts
    @GetMapping("/{farmId}/alerts")
    public ResponseEntity<Map<String, Object>> getAlerts(@PathVariable Integer farmId) {
        return ResponseEntity.ok(weatherService.generateAlerts(farmId));
    }
}