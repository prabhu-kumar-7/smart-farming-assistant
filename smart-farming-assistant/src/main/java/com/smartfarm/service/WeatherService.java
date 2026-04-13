package com.smartfarm.service;

import com.smartfarm.model.Farm;
import com.smartfarm.model.WeatherData;
import com.smartfarm.repository.FarmRepository;
import com.smartfarm.repository.WeatherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class WeatherService {

    private final WebClient webClient;
    private final WeatherRepository weatherRepository;
    private final FarmRepository farmRepository;

    // Injected from application.properties
    @Value("${weather.api.key}")
    private String apiKey;

    @Value("${weather.api.url}")
    private String apiUrl;

    // ── Fetch weather from OpenWeatherMap + save to DB ───────
    public WeatherData fetchAndSave(Integer farmId) {

        // Step 1: Load farm to get lat/lon
        Farm farm = farmRepository.getFarmById(farmId)
            .orElseThrow(() -> new RuntimeException("Farm not found: " + farmId));

        // Step 2: Call OpenWeatherMap API with lat/lon
        Map response = webClient.get()
            .uri(apiUrl + "?lat={lat}&lon={lon}&appid={key}&units=metric",
                farm.getLatitude(), farm.getLongitude(), apiKey)
            .retrieve()
            .bodyToMono(Map.class)
            .block(); // block() = synchronous — acceptable for simplicity

        // Step 3: Parse the nested JSON response safely
        WeatherData data = parseWeatherResponse(response, farmId);

        // Step 4: Persist snapshot in weather_data table
        weatherRepository.saveWeather(data);

        return data;
    }

    // ── Parse raw OpenWeatherMap JSON → WeatherData ──────────
    @SuppressWarnings("unchecked")
    private WeatherData parseWeatherResponse(Map response, Integer farmId) {
        WeatherData data = new WeatherData();
        data.setFarmId(farmId);

        // Extract main weather fields
        Map<String, Object> main = (Map<String, Object>) response.get("main");
        data.setTemperature(toDouble(main.get("temp")));
        data.setHumidity(toDouble(main.get("humidity")));

        // Wind speed
        Map<String, Object> wind = (Map<String, Object>) response.get("wind");
        data.setWindSpeed(toDouble(wind.get("speed")));

        // Rainfall (optional — not always present in API response)
        Map<String, Object> rain = (Map<String, Object>) response.getOrDefault("rain", Map.of());
        data.setRainfall(toDouble(rain.getOrDefault("1h", 0.0)));

        // Weather description (e.g. "clear sky")
        var weatherList = (java.util.List<Map<String, Object>>) response.get("weather");
        if (weatherList != null && !weatherList.isEmpty()) {
            data.setWeatherDesc((String) weatherList.get(0).get("description"));
        }

        return data;
    }

    // ── Safe number converter (API returns Integer or Double) ─
    private Double toDouble(Object val) {
        if (val == null) return 0.0;
        return ((Number) val).doubleValue();
    }

    // ── Get saved weather history for a farm ─────────────────
    public java.util.List<WeatherData> getWeatherHistory(Integer farmId) {
        return weatherRepository.getLatestByFarm(farmId);
    } 
    // ── Generate weather alerts based on thresholds ──────────
public Map<String, Object> generateAlerts(Integer farmId) {

    // Get the latest weather record for this farm
    var history = weatherRepository.getLatestByFarm(farmId);
    if (history.isEmpty()) {
        return Map.of("alert", "No weather data available");
    }

    WeatherData latest = history.get(0);
    String alert = "No alerts";
    String severity = "normal";

    // Rule: Rainfall > 50mm → heavy rain alert
    if (latest.getRainfall() > 50) {
        alert = "⚠️ Heavy Rain Alert — Consider drainage management";
        severity = "high";
    }
    // Rule: Humidity < 30% + no rainfall → drought warning
    else if (latest.getHumidity() < 30 && latest.getRainfall() == 0) {
        alert = "🔥 Drought Alert — Immediate irrigation recommended";
        severity = "high";
    }
    // Rule: Temperature > 38°C → heat stress warning
    else if (latest.getTemperature() > 38) {
        alert = "🌡️ Heat Stress Alert — Protect crops from heat damage";
        severity = "medium";
    }

    return Map.of(
        "farmId", farmId,
        "alert", alert,
        "severity", severity,
        "temperature", latest.getTemperature(),
        "humidity", latest.getHumidity(),
        "rainfall", latest.getRainfall()
    );
}
}