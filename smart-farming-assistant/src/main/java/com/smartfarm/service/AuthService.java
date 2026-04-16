package com.smartfarm.service;

import com.smartfarm.config.JwtUtil;
import com.smartfarm.dto.LoginRequest;
import com.smartfarm.dto.RegisterRequest;
import com.smartfarm.model.User;
import com.smartfarm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    // Use injected bean — NOT new BCryptPasswordEncoder()
    private final BCryptPasswordEncoder passwordEncoder;

    // ── Register ──────────────────────────────────────────────
    public Map<String, Object> register(RegisterRequest req) {

        // Validate input
        if (req.getFullName() == null || req.getFullName().isBlank()) {
            throw new RuntimeException("Full name is required");
        }
        if (req.getEmail() == null || req.getEmail().isBlank()) {
            throw new RuntimeException("Email is required");
        }
        if (req.getPassword() == null || req.getPassword().length() < 6) {
            throw new RuntimeException("Password must be at least 6 characters");
        }

        // Check duplicate email
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already registered. Please login.");
        }

        // Build user object
        User user = new User();
        user.setFullName(req.getFullName());
        user.setEmail(req.getEmail().toLowerCase().trim());
        user.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        user.setRole("farmer");

        userRepository.save(user);

        // Auto-login after register
        String token = jwtUtil.generateToken(
            user.getEmail(), user.getFullName()
        );

        return Map.of(
            "token",    token,
            "fullName", req.getFullName(),
            "email",    req.getEmail(),
            "message",  "Registration successful"
        );
    }

    // ── Login ─────────────────────────────────────────────────
    public Map<String, Object> login(LoginRequest req) {

        // Find user — generic error message for security
        User user = userRepository.findByEmail(
            req.getEmail().toLowerCase().trim()
        ).orElseThrow(() ->
            new RuntimeException("Invalid email or password")
        );

        // Verify password
        if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(
            user.getEmail(), user.getFullName()
        );

        return Map.of(
            "token",    token,
            "fullName", user.getFullName(),
            "email",    user.getEmail(),
            "message",  "Login successful"
        );
    }
}