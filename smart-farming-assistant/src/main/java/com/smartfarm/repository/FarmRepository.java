package com.smartfarm.repository;

import com.smartfarm.model.Farm;
import com.smartfarm.model.Farmer;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class FarmRepository {

    private final JdbcTemplate jdbcTemplate;

    // ── RowMapper: maps DB row → Farmer object ──────────────
    private final RowMapper<Farmer> farmerMapper = (rs, rowNum) -> {
        Farmer f = new Farmer();
        f.setId(rs.getInt("id"));
        f.setName(rs.getString("name"));
        f.setPhone(rs.getString("phone"));
        f.setEmail(rs.getString("email"));
        f.setLocation(rs.getString("location"));
        f.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        return f;
    };

    // ── RowMapper: maps DB row → Farm object ────────────────
    private final RowMapper<Farm> farmMapper = (rs, rowNum) -> {
        Farm farm = new Farm();
        farm.setId(rs.getInt("id"));
        farm.setFarmerId(rs.getInt("farmer_id"));
        farm.setFarmName(rs.getString("farm_name"));
        farm.setSoilType(rs.getString("soil_type"));
        farm.setCropType(rs.getString("crop_type"));
        farm.setAreaAcres(rs.getDouble("area_acres"));
        farm.setLatitude(rs.getDouble("latitude"));
        farm.setLongitude(rs.getDouble("longitude"));
        farm.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        return farm;
    };

    // ── Insert Farmer, return generated ID ──────────────────
    public Integer saveFarmer(Farmer farmer) {
        String sql = """
            INSERT INTO farmers (name, phone, email, location)
            VALUES (?, ?, ?, ?)
            """;

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, farmer.getName());
            ps.setString(2, farmer.getPhone());
            ps.setString(3, farmer.getEmail());
            ps.setString(4, farmer.getLocation());
            return ps;
        }, keyHolder);

        // Return the auto-generated farmer ID
        return (Integer) keyHolder.getKeys().get("id");
    }

    // ── Insert Farm linked to Farmer ────────────────────────
    public Integer saveFarm(Farm farm) {
        String sql = """
            INSERT INTO farms (farmer_id, farm_name, soil_type, crop_type, area_acres, latitude, longitude)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """;

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, farm.getFarmerId());
            ps.setString(2, farm.getFarmName());
            ps.setString(3, farm.getSoilType());
            ps.setString(4, farm.getCropType());
            ps.setDouble(5, farm.getAreaAcres());
            ps.setDouble(6, farm.getLatitude());
            ps.setDouble(7, farm.getLongitude());
            return ps;
        }, keyHolder);

        return (Integer) keyHolder.getKeys().get("id");
    }

    // ── Get all farms ────────────────────────────────────────
    public List<Farm> getAllFarms() {
        return jdbcTemplate.query("SELECT * FROM farms ORDER BY created_at DESC", farmMapper);
    }

    // ── Get farm by ID ───────────────────────────────────────
    public Optional<Farm> getFarmById(Integer id) {
        List<Farm> result = jdbcTemplate.query(
            "SELECT * FROM farms WHERE id = ?", farmMapper, id
        );
        return result.stream().findFirst();
    }

    // ── Get all farmers ──────────────────────────────────────
    public List<Farmer> getAllFarmers() {
        return jdbcTemplate.query("SELECT * FROM farmers ORDER BY created_at DESC", farmerMapper);
    }
}