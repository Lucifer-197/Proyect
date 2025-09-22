package com.proyect.gateway.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public Claims extractAllClaims(String token) { 
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token) // Parsea y valida el Jwt
                .getBody();
    }

    public boolean validateToken(String token) {
        try {
            extractAllClaims(token); // Intenta leer el token
            return true;
        } catch (Exception e) {
            System.out.println("Error de validación JWT en Gateway: " + e.getMessage());
            return false;
        }
    }
}
