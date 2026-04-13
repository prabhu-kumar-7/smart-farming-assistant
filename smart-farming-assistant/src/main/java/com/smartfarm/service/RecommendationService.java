package com.smartfarm.service;

import com.smartfarm.model.Farm;
import com.smartfarm.model.Recommendation;
import com.smartfarm.model.WeatherData;
import com.smartfarm.repository.FarmRepository;
import com.smartfarm.repository.RecommendationRepository;
import com.smartfarm.repository.WeatherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final FarmRepository farmRepository;
    private final WeatherRepository weatherRepository;
    private final RecommendationRepository recommendationRepository;

    // ── Entry point: generate all recommendations for a farm ─
    public List<Recommendation> generate(Integer farmId) {

        // Step 1: Load farm data
        Farm farm = farmRepository.getFarmById(farmId)
            .orElseThrow(() -> new RuntimeException("Farm not found: " + farmId));

        // Step 2: Load latest weather snapshot
        List<WeatherData> history = weatherRepository.getLatestByFarm(farmId);
        WeatherData weather = history.isEmpty() ? defaultWeather(farmId) : history.get(0);

        // Step 3: Run all rule engines
        List<Recommendation> results = new ArrayList<>();
        results.add(cropRecommendation(farm, weather));
        results.add(irrigationRecommendation(farm, weather));
        results.add(fertilizerRecommendation(farm, weather));

        // Step 4: Persist each recommendation
        results.forEach(recommendationRepository::save);

        return results;
    }

    // ── RULE ENGINE 1: Crop Suggestion ───────────────────────
    private Recommendation cropRecommendation(Farm farm, WeatherData w) {
        String soil = farm.getSoilType().toLowerCase();
        double temp = w.getTemperature();
        double rain = w.getRainfall();
        String msg;

        // Rule matrix: soil type + temperature + rainfall
        if (soil.equals("loamy") && temp >= 20 && temp <= 30) {
            msg = "🌾 Ideal conditions for Rice or Wheat. Loamy soil retains moisture well.";
        } else if (soil.equals("sandy") && temp >= 25 && temp <= 35) {
            msg = "🥜 Sandy soil suits Groundnut or Millet. These crops tolerate dry heat.";
        } else if (soil.equals("clay") && rain > 20) {
            msg = "🌿 Clay soil with good rain — ideal for Sugarcane or Jute.";
        } else if (temp > 35) {
            msg = "🌵 High temperature detected. Consider drought-resistant crops like Sorghum.";
        } else if (temp < 15) {
            msg = "❄️ Cool conditions — suitable for Mustard, Barley, or Peas.";
        } else {
            msg = "🌱 General conditions — Maize or Vegetables recommended for mixed soil.";
        }

        return buildRec(farm.getId(), "crop", msg);
    }

    // ── RULE ENGINE 2: Irrigation Advice ─────────────────────
    private Recommendation irrigationRecommendation(Farm farm, WeatherData w) {
        double rain = w.getRainfall();
        double humidity = w.getHumidity();
        double temp = w.getTemperature();
        String msg;

        // Rule: sufficient rain → skip irrigation
        if (rain > 30) {
            msg = "💧 Sufficient rainfall detected. Skip irrigation for next 24–48 hours.";
        }
        // Rule: low humidity + high temp → urgent irrigation
        else if (humidity < 35 && temp > 32) {
            msg = "🚨 Low humidity + High temperature! Irrigate immediately — drip method preferred.";
        }
        // Rule: moderate conditions → schedule irrigation
        else if (rain < 10 && humidity < 50) {
            msg = "⏰ Low rainfall. Schedule irrigation every 2 days. Use sprinkler for efficiency.";
        }
        // Rule: moderate rain
        else if (rain >= 10 && rain <= 30) {
            msg = "✅ Moderate rainfall. Supplement with light irrigation every 3–4 days.";
        }
        else {
            msg = "💦 Monitor soil moisture. Irrigate when topsoil appears dry (2cm depth).";
        }

        return buildRec(farm.getId(), "irrigation", msg);
    }

    // ── RULE ENGINE 3: Fertilizer Guidance ───────────────────
    private Recommendation fertilizerRecommendation(Farm farm, WeatherData w) {
        String soil = farm.getSoilType().toLowerCase();
        String crop = farm.getCropType() != null
            ? farm.getCropType().toLowerCase() : "general";
        double temp = w.getTemperature();
        String msg;

        // Rule: loamy + rice/wheat → NPK schedule
        if (soil.equals("loamy") && (crop.contains("rice") || crop.contains("wheat"))) {
            msg = "🧪 Apply NPK (20:20:10) at sowing. Top-dress Urea after 3 weeks.";
        }
        // Rule: sandy soil → needs more nitrogen
        else if (soil.equals("sandy")) {
            msg = "🌱 Sandy soil drains fast. Use slow-release Nitrogen fertilizer. Add organic compost.";
        }
        // Rule: clay soil → phosphorus focus
        else if (soil.equals("clay")) {
            msg = "🪨 Clay soil — apply Phosphorus-rich fertilizer. Avoid over-watering after application.";
        }
        // Rule: high temp → avoid heavy chemical fertilizers
        else if (temp > 35) {
            msg = "⚠️ High temperature! Avoid chemical fertilizers now — use organic compost to reduce stress.";
        }
        else {
            msg = "🌿 Apply balanced NPK (15:15:15). Follow up with micronutrient spray after 30 days.";
        }

        return buildRec(farm.getId(), "fertilizer", msg);
    }

    // ── Helper: Build Recommendation object ──────────────────
    private Recommendation buildRec(Integer farmId, String type, String message) {
        Recommendation rec = new Recommendation();
        rec.setFarmId(farmId);
        rec.setRecType(type);
        rec.setMessage(message);
        return rec;
    }

    // ── Fallback: default weather if no data exists ───────────
    private WeatherData defaultWeather(Integer farmId) {
        WeatherData w = new WeatherData();
        w.setFarmId(farmId);
        w.setTemperature(25.0);   // safe default
        w.setHumidity(60.0);
        w.setRainfall(10.0);
        w.setWindSpeed(5.0);
        w.setWeatherDesc("unknown");
        return w;
    }

    // ── Get saved recommendations for a farm ─────────────────
    public List<Recommendation> getByFarmId(Integer farmId) {
        return recommendationRepository.getByFarmId(farmId);
    }
}