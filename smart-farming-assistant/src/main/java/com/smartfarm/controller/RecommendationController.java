package com.smartfarm.controller;

import com.smartfarm.dto.RecommendationRequest;
import com.smartfarm.model.Recommendation;
import com.smartfarm.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    // POST /api/recommend — Generate fresh recommendations for a farm
    @PostMapping("/recommend")
    public ResponseEntity<List<Recommendation>> recommend( 
            @RequestBody RecommendationRequest request) {
        List<Recommendation> recs = recommendationService.generate(request.getFarmId());
        return ResponseEntity.ok(recs); 
    }

    // GET /api/recommend/{farmId} — Get previously saved recommendations
    @GetMapping("/recommend/{farmId}")
    public ResponseEntity<List<Recommendation>> getRecommendations(
            @PathVariable Integer farmId) {
        return ResponseEntity.ok(recommendationService.getByFarmId(farmId));
    }
}