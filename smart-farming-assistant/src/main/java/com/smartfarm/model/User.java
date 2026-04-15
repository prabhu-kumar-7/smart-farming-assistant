package com.smartfarm.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private Integer id;
    private String fullName;
    private String email;
    private String passwordHash;
    private String role;
    private LocalDateTime createdAt;
}