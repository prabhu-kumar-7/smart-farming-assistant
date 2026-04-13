package com.smartfarm.repository;

import com.smartfarm.model.WeatherData;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class WeatherRepository {

    private final JdbcTemplate jdbcTemplate;

    // ── RowMapper: DB row → WeatherData object ───────────────
    private final RowMapper<WeatherData> weatherMapper = (rs, rowNum) -> {
        WeatherData w = new WeatherData();
        w.setId(rs.getInt("id"));
        w.setFarmId(rs.getInt("farm_id"));
        w.setTemperature(rs.getDouble("temperature"));
        w.setHumidity(rs.getDouble("humidity"));
        w.setRainfall(rs.getDouble("rainfall"));
        w.setWindSpeed(rs.getDouble("wind_speed"));
        w.setWeatherDesc(rs.getString("weather_desc"));
        w.setFetchedAt(rs.getTimestamp("fetched_at").toLocalDateTime());
        return w;
    };

    // ── Save fetched weather snapshot to DB ──────────────────
    public void saveWeather(WeatherData data) {
        String sql = """
            INSERT INTO weather_data
                (farm_id, temperature, humidity, rainfall, wind_speed, weather_desc)
            VALUES (?, ?, ?, ?, ?, ?)
            """;
        jdbcTemplate.update(sql,
            data.getFarmId(),
            data.getTemperature(),
            data.getHumidity(),
            data.getRainfall(),
            data.getWindSpeed(),
            data.getWeatherDesc()
        );
    }

    // ── Get latest weather record for a farm ─────────────────
    public List<WeatherData> getLatestByFarm(Integer farmId) {
        String sql = """
            SELECT * FROM weather_data
            WHERE farm_id = ?
            ORDER BY fetched_at DESC
            LIMIT 5
            """;
        return jdbcTemplate.query(sql, weatherMapper, farmId);
    }
}