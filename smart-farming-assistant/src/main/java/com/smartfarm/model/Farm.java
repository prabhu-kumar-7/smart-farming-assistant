package com.smartfarm.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Farm {
    private Integer id;
    private Integer farmerId;       // FK → farmers.id
    private String farmName;
    private String soilType;        // loamy / sandy / clay
    private String cropType;
    private Double areaAcres;
    private Double latitude;        // used for weather API
    private Double longitude;
    private LocalDateTime createdAt;
}