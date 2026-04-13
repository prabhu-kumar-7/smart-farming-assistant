package com.smartfarm.dto;

import lombok.Data;

// DTO = Data Transfer Object — what the frontend sends in POST body
@Data
public class FarmRequest {

    // Farmer fields
    private String farmerName;
    private String phone;
    private String email;
    private String location;

    // Farm fields
    private String farmName;
    private String soilType;
    private String cropType;
    private Double areaAcres;
    private Double latitude;
    private Double longitude;
}