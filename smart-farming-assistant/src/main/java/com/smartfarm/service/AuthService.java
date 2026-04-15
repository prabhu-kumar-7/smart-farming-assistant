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
    private final BCryptPasswordEncoder encoder;

    // ── Register new user ─────────────────────────────────────
    public Map<String, Object> register(RegisterRequest req) {

        // Check if email already taken
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Build user with hashed password — never store plain text
        User user = new User();
        user.setFullName(req.getFullName());
        user.setEmail(req.getEmail());
        user.setPasswordHash(encoder.encode(req.getPassword()));
        user.setRole("farmer");

        userRepository.save(user);

        // Generate token immediately after register
        String token = jwtUtil.generateToken(req.getEmail(), req.getFullName());

        return Map.of(
            "token",    token,
            "fullName", req.getFullName(),
            "email",    req.getEmail(),
            "message",  "Registration successful"
        );
    }

    // ── Login existing user ───────────────────────────────────
    public Map<String, Object> login(LoginRequest req) {

        // Find user by email
        User user = userRepository.findByEmail(req.getEmail())
            .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        // Verify password against hash
        if (!encoder.matches(req.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail(), user.getFullName());

        return Map.of(
            "token",    token,
            "fullName", user.getFullName(),
            "email",    user.getEmail(),
            "message",  "Login successful"
        );
    }
}