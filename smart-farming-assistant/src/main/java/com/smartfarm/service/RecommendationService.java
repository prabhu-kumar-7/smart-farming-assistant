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
        String currentCrop = farm.getCropType() != null ? farm.getCropType().toLowerCase() : "none";
        Double area = farm.getAreaAcres() != null ? farm.getAreaAcres() : 0.0;
        double temp = w.getTemperature();
        double rain = w.getRainfall();
        double humidity = w.getHumidity();
        String farmName = farm.getFarmName();
        String msg;

        // Enhanced rule matrix: soil + temp + rain + area + current crop + humidity
        if (soil.equals("loamy")) {
            if (temp >= 20 && temp <= 30 && humidity > 50) {
                msg = String.format("🌾 %s (%.1f acres): Loamy soil + ideal temp. Rice is optimal. Top-dress at 3-leaf stage.", farmName, area);
            } else if (temp > 30 && rain > 25) {
                msg = String.format("🌿 %s: Loamy soil + warm + rainy. Shift to Wheat for next season or continue Rice with extra drainage.", farmName);
            } else {
                msg = String.format("🌱 %s: Loamy soil + current temp %.1f°C. Consider rotation: if was Rice, try Wheat or Vegetables (%.1f acres suitable).", farmName, temp, area);
            }
        } else if (soil.equals("sandy")) {
            if (temp >= 25 && temp <= 35 && humidity < 40) {
                msg = String.format("🥜 %s (%.1f acres): Sandy soil + hot + dry. Groundnut or Millet. Use drip irrigation.", farmName, area);
            } else if (rain > 20) {
                msg = String.format("🌾 %s: Sandy soil + unexpected rain. Pearl Millet thrives. Add mulch to retain moisture.", farmName);
            } else {
                msg = String.format("🌞 %s: Sandy soil needs drought crops. Sorghum or Pulses recommended (%.1f acres).", farmName, area);
            }
        } else if (soil.equals("clay")) {
            if (rain > 20 && temp >= 20 && temp <= 30) {
                msg = String.format("🌿 %s (%.1f acres): Clay soil + good rain + moderate temp. Ideal for Sugarcane or Cotton.", farmName, area);
            } else if (humidity > 70 && rain > 15) {
                msg = String.format("🌱 %s: Clay soil + very humid + rainy. Jute or Pulses (Arhar). Ensure drainage.", farmName);
            } else {
                msg = String.format("🪨 %s: Clay soil challenging now. Try Chickpea or Mustard for this season (%.1f acres).", farmName, area);
            }
        } else { // mixed/other
            if (temp > 35 && humidity < 30) {
                msg = String.format("🌵 %s (%.1f acres): Extreme heat + low humidity. Emergency: Sorghum or Drought-resistant Pulses.", farmName, area);
            } else if (temp < 15) {
                msg = String.format("❄️ %s: Cool conditions (%.1f°C). Mustard, Barley, or Peas suited for %.1f acres.", farmName, temp, area);
            } else {
                msg = String.format("🌱 %s (%.1f acres): Mixed conditions. Maize + Vegetables intercropping recommended.", farmName, area);
            }
        }

        return buildRec(farm.getId(), "crop", msg);
    }

    // ── RULE ENGINE 2: Irrigation Advice ─────────────────────
    private Recommendation irrigationRecommendation(Farm farm, WeatherData w) {
        double rain = w.getRainfall();
        double humidity = w.getHumidity();
        double temp = w.getTemperature();
        String farmName = farm.getFarmName();
        Double area = farm.getAreaAcres() != null ? farm.getAreaAcres() : 0.0;
        String msg;

        // Rule: sufficient rain → skip irrigation
        if (rain > 30) {
            msg = String.format("💧 %s: Sufficient rainfall (%.1fmm). Skip irrigation 24–48 hrs. Monitor soil surface.", farmName, rain);
        }
        // Rule: low humidity + high temp → urgent irrigation
        else if (humidity < 35 && temp > 32) {
            msg = String.format("🚨 %s (%.1f acres): CRITICAL! Humidity %.1f%%, Temp %.1f°C. Irrigate immediately using DRIP. Double frequency.", farmName, area, humidity, temp);
        }
        // Rule: moderate conditions → schedule irrigation
        else if (rain < 10 && humidity < 50) {
            msg = String.format("⏰ %s: Low rainfall (%.1fmm) + moderate humidity. Irrigate EVERY 2 DAYS. Sprinkler efficient for %.1f acres.", farmName, rain, area);
        }
        // Rule: moderate rain
        else if (rain >= 10 && rain <= 30) {
            msg = String.format("✅ %s: Moderate rainfall (%.1fmm) + Humidity %.1f%%. Light irrigation every 3–4 days. Drip preferred.", farmName, rain, humidity);
        }
        else {
            msg = String.format("💦 %s (%.1f acres): Monitor soil moisture daily at 2cm depth near root zone. Irrigate when dry.", farmName, area);
        }

        return buildRec(farm.getId(), "irrigation", msg);
    }

    // ── RULE ENGINE 3: Fertilizer Guidance ───────────────────
    private Recommendation fertilizerRecommendation(Farm farm, WeatherData w) {
        String soil = farm.getSoilType().toLowerCase();
        String crop = farm.getCropType() != null
            ? farm.getCropType().toLowerCase() : "general";
        Double area = farm.getAreaAcres() != null ? farm.getAreaAcres() : 0.0;
        double temp = w.getTemperature();
        double humidity = w.getHumidity();
        double rain = w.getRainfall();
        String farmName = farm.getFarmName();
        String msg;

        // Rule: loamy + rice/wheat → NPK schedule
        if (soil.equals("loamy") && (crop.contains("rice") || crop.contains("wheat"))) {
            double nRate = area * 40;  // kg/acre
            msg = String.format("🧪 %s (%.1f acres): Loamy + %s. Apply NPK 20:20:10 (%d kg). Top-dress UREA after 3 weeks (%d kg).", 
                farmName, area, crop.toUpperCase(), (int)nRate, (int)(nRate * 0.5));
        }
        // Rule: sandy soil → needs more nitrogen + organic
        else if (soil.equals("sandy")) {
            msg = String.format("🌱 %s (%.1f acres): Sandy soil drains fast. Use slow-release Nitrogen (%d kg/acre). Add organic compost 5 tons/acre.", 
                farmName, area, (int)(area * 25));
        }
        // Rule: clay soil → phosphorus focus
        else if (soil.equals("clay")) {
            msg = String.format("🪨 %s (%.1f acres): Clay soil. Apply Phosphorus-heavy NPK 15:25:15 (%d kg). Avoid over-watering post-application.", 
                farmName, area, (int)(area * 35));
        }
        // Rule: high temp → avoid heavy chemical fertilizers
        else if (temp > 35) {
            msg = String.format("⚠️ %s: Extreme heat (%.1f°C)! Skip chemical fertilizers now. Use organic compost (%d tons) to reduce crop stress.", 
                farmName, temp, (int)(area * 5));
        }
        // Rule: variable - balanced NPK
        else if (humidity > 70 && rain > 20) {
            msg = String.format("💧 %s (%.1f acres): High humidity + rain. Apply balanced NPK 15:15:15 coated fertilizer (leaching risk). Micronutrient spray after 30 days.", 
                farmName, area);
        }
        else {
            msg = String.format("🌿 %s (%.1f acres): Moderate conditions. Apply balanced NPK 15:15:15 (%d kg). Micronutrient spray 30 days post-application.", 
                farmName, area, (int)(area * 30));
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