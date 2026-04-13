package com.smartfarm.repository;

import com.smartfarm.model.Recommendation;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class RecommendationRepository {

    private final JdbcTemplate jdbcTemplate;

    // ── RowMapper: DB row → Recommendation object ────────────
    private final RowMapper<Recommendation> recMapper = (rs, rowNum) -> {
        Recommendation r = new Recommendation();
        r.setId(rs.getInt("id"));
        r.setFarmId(rs.getInt("farm_id"));
        r.setRecType(rs.getString("rec_type"));
        r.setMessage(rs.getString("message"));
        r.setGeneratedAt(rs.getTimestamp("generated_at").toLocalDateTime());
        return r;
    };

    // ── Save one recommendation ───────────────────────────────
    public void save(Recommendation rec) {
        String sql = """
            INSERT INTO recommendations (farm_id, rec_type, message)
            VALUES (?, ?, ?)
            """;
        jdbcTemplate.update(sql,
            rec.getFarmId(),
            rec.getRecType(),
            rec.getMessage()
        );
    }

    // ── Get all recommendations for a farm ───────────────────
    public List<Recommendation> getByFarmId(Integer farmId) {
        String sql = """
            SELECT * FROM recommendations
            WHERE farm_id = ?
            ORDER BY generated_at DESC
            """;
        return jdbcTemplate.query(sql, recMapper, farmId);
    }
}