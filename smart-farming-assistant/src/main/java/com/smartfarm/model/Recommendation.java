package com.smartfarm.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Recommendation {
    private Integer id;
    private Integer farmId;
    private String recType;       // crop / irrigation / fertilizer
    private String message;       // actual advice text
    private LocalDateTime generatedAt;
}