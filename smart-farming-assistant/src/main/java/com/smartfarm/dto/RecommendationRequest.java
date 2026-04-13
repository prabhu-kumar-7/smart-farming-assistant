package com.smartfarm.dto;

import lombok.Data;

// Frontend sends farmId — backend fetches everything else internally
@Data
public class RecommendationRequest {
    private Integer farmId;
}