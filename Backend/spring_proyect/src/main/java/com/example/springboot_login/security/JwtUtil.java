package com.example.springboot_login.security;

import io.jsonwebtoken.*; // Librería principal de JWT para generar y parsear tokens
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.List;

@Component // Indica que esta clase es un componente de Spring, para poder inyectarla donde se necesite
public class JwtUtil {

    //  Secret key para firmar el access token (viene del archivo application.properties)
    @Value("${jwt.secret}")
    private String accessSecret;

    // Tiempo de expiración del access token en milisegundos
    @Value("${jwt.expirationMs}")
    private long accessExpirationMs;

    // Secret key para firmar el refresh token (diferente del access)
    @Value("${jwt.refreshSecret}")
    private String refreshSecret;

    // Tiempo de expiración del refresh token
    @Value("${jwt.refreshExpirationMs}")
    private long refreshExpirationMs;

    // Método privado que obtiene la llave firmadora del access token
    private Key getAccessSigningKey() {
        return Keys.hmacShaKeyFor(accessSecret.getBytes());
    }

    // Método privado que obtiene la llave firmadora del refresh token
    private Key getRefreshSigningKey() {
        return Keys.hmacShaKeyFor(refreshSecret.getBytes());
    }

    // Generar access token con el nombre de usuario y rol como claims
   public String generateToken(String nombreUsuario, String rol) {
    return Jwts.builder()
            .setSubject(nombreUsuario)
            .claim("roles", List.of(rol)) // sin prefijo
            .setIssuedAt(new Date(System.currentTimeMillis()))
            .setExpiration(new Date(System.currentTimeMillis() + accessExpirationMs))
            .signWith(getAccessSigningKey(), SignatureAlgorithm.HS256)
            .compact();
}


    // Generar refresh token con solo el username como subject
    public String generateRefreshToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + refreshExpirationMs))
                .signWith(getRefreshSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Verificar si un access token es válido (estructura y firma)
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(getAccessSigningKey()) // Se usa la llave de firma del access
                .build()
                .parseClaimsJws(token); // Intenta parsear el token
            return true; // Si no lanza excepción, es válido
        } catch (JwtException e) {
            return false; // Si lanza cualquier excepción, es inválido
        }
    }

    // Validar refresh token y extraer el username (subject) del token
    public String validateRefreshTokenAndGetUsername(String refreshToken) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getRefreshSigningKey()) // Se usa la llave de firma del refresh
                    .build()
                    .parseClaimsJws(refreshToken)
                    .getBody(); // Se extraen los datos (claims)
            return claims.getSubject(); // Se retorna el subject que es el username
        } catch (JwtException e) {
            throw new RuntimeException("Refresh token inválido o expirado"); // Se lanza excepción si no es válido
        }
    }

    // Obtener los claims de un access token válido
    public Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getAccessSigningKey()) // Usa la llave del access token
                .build()
                .parseClaimsJws(token)
                .getBody(); // Devuelve el contenido (claims) del token
    }
}
