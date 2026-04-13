package com.smartfarm.dto;

import lombok.Data;

// What the frontend sends to /api/chat
@Data
public class ChatRequest {
    private Integer farmId;       // used to load farm context
    private String userQuery;     // farmer's actual question
} 