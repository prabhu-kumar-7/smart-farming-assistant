package com.smartfarm.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data                   // Lombok: generates getters, setters, toString
@NoArgsConstructor      // Lombok: generates no-arg constructor
@AllArgsConstructor     // Lombok: generates all-arg constructor
public class Farmer {
    private Integer id;
    private String name;
    private String phone;
    private String email;
    private String location;
    private LocalDateTime createdAt;
}