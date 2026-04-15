package com.smartfarm.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    // Generate signing key from secret string
    private Key getKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    // ── Generate JWT token for a user ────────────────────────
    public String generateToken(String email, String fullName) {
        return Jwts.builder()
            .setSubject(email)
            .claim("fullName", fullName)    // embed name in token
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + expiration))
            .signWith(getKey(), SignatureAlgorithm.HS256)
            .compact();
    }

    // ── Extract email from token ──────────────────────────────
    public String getEmail(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(getKey()).build()
            .parseClaimsJws(token)
            .getBody()
            .getSubject();
    }

    // ── Validate token is valid and not expired ───────────────
    public boolean isValid(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(getKey()).build()
                .parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }
}