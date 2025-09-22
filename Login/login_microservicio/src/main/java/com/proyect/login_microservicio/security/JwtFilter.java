package com.proyect.login_microservicio.security;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;
import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;                                                                                                   

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter {

    // Se obtiene el secreto para firmar/verificar JWT desde application.properties
    @Value("${jwt.secret}")
    private String jwtSecret;

    private SecretKey secretKey;

    // Convierte el secreto en una clave criptográfica válida al iniciar la aplicación
    @PostConstruct
    public void init() {
        secretKey = Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // Mostrar en consola qué endpoint fue interceptado por el filtro
        String path = request.getRequestURI();
        System.out.println("JwtFilter interceptó path: " + path);

        // Si la petición es de tipo OPTIONS (CORS preflight), no se valida token
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        // Si la ruta es pública (login, registro, refresh), se deja pasar sin validar
        if (path.startsWith("/api/login") ||
            path.startsWith("/api/register") ||
            path.startsWith("/api/refresh-token")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Buscar token: primero en el header Authorization
        String token = null;
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7); // Se quita "Bearer "
        }

        // Si no está en el header, se busca en las cookies
        if (token == null && request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("accessToken".equals(cookie.getName())) {
                    token = cookie.getValue();
                }
            }
        }

        // Validar el token si se encontró
        if (token != null) {
            try {
                // Parsear y verificar el JWT con la clave secreta
                Claims claims = Jwts.parserBuilder()
                        .setSigningKey(secretKey)
                        .build()
                        .parseClaimsJws(token)
                        .getBody();

                // Obtener el usuario y sus roles desde los claims
                String username = claims.getSubject();
                List<String> roles = claims.get("roles", List.class);

                // Si hay usuario y aún no está autenticado en el contexto
                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    // Convertir roles en objetos de Spring Security
                    List<SimpleGrantedAuthority> authorities = roles.stream()
                            .map(SimpleGrantedAuthority::new)
                            .collect(Collectors.toList());

                    // Crear un objeto de autenticación con usuario y roles
                    UsernamePasswordAuthenticationToken auth =
                            new UsernamePasswordAuthenticationToken(username, null, authorities);

                    // Asociar detalles de la petición (IP, sesión, etc.)
                    auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // Guardar la autenticación en el contexto de seguridad
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            } catch (Exception e) {
                // Si el token no es válido o expiró → devolver 401 (No autorizado)
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
        }

        // Continuar con el flujo normal (otros filtros o el controlador)
        filterChain.doFilter(request, response);
    }
}
