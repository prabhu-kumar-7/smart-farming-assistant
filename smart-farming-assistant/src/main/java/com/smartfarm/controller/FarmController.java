package com.smartfarm.controller;

import com.smartfarm.dto.FarmRequest;
import com.smartfarm.model.Farm;
import com.smartfarm.model.Farmer;
import com.smartfarm.service.FarmService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class FarmController {

    private final FarmService farmService;

    // POST /api/farm — Register a new farmer + farm
    @PostMapping("/farm")
    public ResponseEntity<Map<String, Object>> registerFarm(
            @RequestBody FarmRequest request) {
        Map<String, Object> response = farmService.registerFarm(request);
        return ResponseEntity.ok(response);
    }

    // GET /api/farms — List all farms
    @GetMapping("/farms")
    public ResponseEntity<List<Farm>> getAllFarms() {
        return ResponseEntity.ok(farmService.getAllFarms());
    }

    // GET /api/farms/{id} — Get single farm by ID
    @GetMapping("/farms/{id}")
    public ResponseEntity<Farm> getFarmById(@PathVariable Integer id) {
        return ResponseEntity.ok(farmService.getFarmById(id));
    }

    // GET /api/farmers — List all farmers
    @GetMapping("/farmers")
    public ResponseEntity<List<Farmer>> getAllFarmers() {
        return ResponseEntity.ok(farmService.getAllFarmers());
    }
}