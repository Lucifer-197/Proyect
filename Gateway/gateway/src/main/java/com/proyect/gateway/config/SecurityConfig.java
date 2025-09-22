package com.proyect.gateway.config;

import com.proyect.gateway.security.JwtSecurityContextRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebFluxSecurity //Activa segurudad WebFlux
public class SecurityConfig {

    //Filtro de seguridad, controla como se
    @Bean
    public SecurityWebFilterChain securityFilterChain(ServerHttpSecurity http,
                                                      JwtSecurityContextRepository contextRepository) {
        return http
                 // Desactivar mecanismo de segurudad que no usan APIs
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)
                .formLogin(ServerHttpSecurity.FormLoginSpec::disable)
                .securityContextRepository(contextRepository) // JWT desde cookies
                .authorizeExchange(exchange -> exchange
                        // Configuracion rutas
                        .pathMatchers("/api/login/**", "/api/register/**", "/api/refresh-token/**").permitAll()
                         // Rutas que requieren SUPER_ADMIN
                        .anyExchange().authenticated()
                )
                .build();
    }

    // CORS global
    @Bean
    @Order(Ordered.HIGHEST_PRECEDENCE) // Se aplique antes que
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:4200"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsWebFilter(source);
    }
}
