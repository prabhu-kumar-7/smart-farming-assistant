package com.smartfarm.service;

import com.smartfarm.model.WeatherData;
import com.smartfarm.repository.FarmRepository;
import com.smartfarm.repository.WeatherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final WebClient webClient;
    private final FarmRepository farmRepository;
    private final WeatherRepository weatherRepository;

    // Injected from application.properties
    @Value("${openai.api.key}")
    private String apiKey;

    @Value("${openai.api.url}")
    private String apiUrl;

    @Value("${groq.model}")
    private String groqModel;

    // ── Main entry: build context + call Groq + return reply ──
    public String chat(Integer farmId, String userQuery) {

        // Step 1: Build farm + weather context string
        String context = buildFarmContext(farmId);

        // Step 2: System role — tells LLM how to behave
        String systemPrompt = """
                You are an expert agricultural assistant AI.
                You help farmers make smart decisions based on their
                farm data, soil type, weather conditions, and crop type.
                Always give practical, concise, and actionable advice.
                Respond in simple language a farmer can understand.
                """;

        // Step 3: User message = farm context + actual question
        String userMessage = String.format("""
                Farm Context:
                %s

                Farmer's Question:
                %s
                """, context, userQuery);

        // Step 4: Build Groq-compatible request body
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", groqModel);     // injected from properties
        requestBody.put("max_tokens", 500);      // limit response length
        requestBody.put("temperature", 0.7);     // creativity level
        requestBody.put("messages", List.of(
                Map.of("role", "system", "content", systemPrompt),
                Map.of("role", "user", "content", userMessage)
        ));

        // Step 5: POST to Groq API with Bearer auth
        Map response = webClient.post()
                .uri(apiUrl)
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .onStatus(
                    // Surface 4xx errors clearly instead of generic failure
                    status -> status.is4xxClientError(),
                    clientResponse -> clientResponse.bodyToMono(String.class)
                            .map(body -> new RuntimeException("Groq API error: " + body))
                )
                .onStatus(
                    // Surface 5xx errors from Groq side
                    status -> status.is5xxServerError(),
                    clientResponse -> clientResponse.bodyToMono(String.class)
                            .map(body -> new RuntimeException("Groq server error: " + body))
                )
                .bodyToMono(Map.class)
                .block(); // synchronous — acceptable for this use case

        // Step 6: Parse and return reply text
        return extractReply(response);
    }

    // ── Build context string from farm + latest weather data ──
    private String buildFarmContext(Integer farmId) {
        StringBuilder ctx = new StringBuilder();

        // Load farm details — gracefully handle missing farm
        farmRepository.getFarmById(farmId).ifPresentOrElse(farm -> {
            ctx.append("Farm Name: ").append(farm.getFarmName()).append("\n");
            ctx.append("Soil Type: ").append(farm.getSoilType()).append("\n");
            ctx.append("Crop Type: ").append(farm.getCropType()).append("\n");
            ctx.append("Location (lat/lon): ")
               .append(farm.getLatitude()).append(", ")
               .append(farm.getLongitude()).append("\n");
        }, () -> ctx.append("Farm: Not found\n"));

        // Load latest weather — gracefully handle missing data
        List<WeatherData> history = weatherRepository.getLatestByFarm(farmId);
        if (!history.isEmpty()) {
            WeatherData w = history.get(0);
            ctx.append("Temperature: ").append(w.getTemperature()).append("°C\n");
            ctx.append("Humidity: ").append(w.getHumidity()).append("%\n");
            ctx.append("Rainfall: ").append(w.getRainfall()).append("mm\n");
            ctx.append("Wind Speed: ").append(w.getWindSpeed()).append("km/h\n");
            ctx.append("Weather: ").append(w.getWeatherDesc()).append("\n");
        } else {
            ctx.append("Weather: No recent data available\n");
        }

        return ctx.toString();
    }

    // ── Extract plain text reply from Groq JSON response ──────
    @SuppressWarnings("unchecked")
    private String extractReply(Map response) {
        try {
            // Groq response structure (same as OpenAI):
            // { choices: [ { message: { content: "reply" } } ] }
            var choices = (List<Map<String, Object>>) response.get("choices");
            var message = (Map<String, Object>) choices.get(0).get("message");
            return (String) message.get("content");
        } catch (Exception e) {
            // Fallback if parsing fails
            return "Sorry, I could not process your request. Please try again.";
        }
    }
}