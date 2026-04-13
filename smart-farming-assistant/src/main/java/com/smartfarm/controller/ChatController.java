package com.smartfarm.controller;

import com.smartfarm.dto.ChatRequest;
import com.smartfarm.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    // POST /api/chat — Accept query + farm context, return AI reply
    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(
            @RequestBody ChatRequest request) {

        // Validate input before hitting the LLM
        if (request.getUserQuery() == null || request.getUserQuery().isBlank()) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Query cannot be empty"));
        }

        String reply = chatService.chat(request.getFarmId(), request.getUserQuery());

        return ResponseEntity.ok(Map.of(
            "query", request.getUserQuery(),
            "reply", reply
        ));
    }
}