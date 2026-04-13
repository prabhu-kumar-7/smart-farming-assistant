package com.smartfarm;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// @SpringBootApplication enables auto-config, component scan, and bean registration
@SpringBootApplication
public class SmartFarmingApplication {
    public static void main(String[] args) {
        SpringApplication.run(SmartFarmingApplication.class, args);
    }
}