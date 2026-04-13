package com.smartfarm.service;

import com.smartfarm.dto.FarmRequest;
import com.smartfarm.model.Farm;
import com.smartfarm.model.Farmer;
import com.smartfarm.repository.FarmRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FarmService {

    private final FarmRepository farmRepository;

    // ── Register farmer + farm in one call ──────────────────
    public Map<String, Object> registerFarm(FarmRequest req) {

        // Step 1: Build and save Farmer
        Farmer farmer = new Farmer();
        farmer.setName(req.getFarmerName());
        farmer.setPhone(req.getPhone());
        farmer.setEmail(req.getEmail());
        farmer.setLocation(req.getLocation());
        Integer farmerId = farmRepository.saveFarmer(farmer);

        // Step 2: Build and save Farm linked to farmer
        Farm farm = new Farm();
        farm.setFarmerId(farmerId);
        farm.setFarmName(req.getFarmName());
        farm.setSoilType(req.getSoilType());
        farm.setCropType(req.getCropType());
        farm.setAreaAcres(req.getAreaAcres());
        farm.setLatitude(req.getLatitude());
        farm.setLongitude(req.getLongitude());
        Integer farmId = farmRepository.saveFarm(farm);

        // Return both IDs in response
        return Map.of(
            "farmerId", farmerId,
            "farmId", farmId,
            "message", "Farm registered successfully"
        );
    }

    public List<Farm> getAllFarms() {
        return farmRepository.getAllFarms();
    }

    public List<Farmer> getAllFarmers() {
        return farmRepository.getAllFarmers();
    }

    public Farm getFarmById(Integer id) {
        return farmRepository.getFarmById(id)
            .orElseThrow(() -> new RuntimeException("Farm not found with id: " + id));
    }
}