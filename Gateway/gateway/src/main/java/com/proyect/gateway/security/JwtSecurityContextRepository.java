package com.proyect.gateway.security;

// Librerías necesarias
import io.jsonwebtoken.Claims; // Para extraer los datos (claims) del JWT
import org.springframework.http.HttpCookie; // Para manejar cookies HTTP en WebFlux
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken; // Contiene la info de autenticación del usuario
import org.springframework.security.core.context.SecurityContext; // Representa el contexto de seguridad
import org.springframework.security.core.context.SecurityContextImpl; // Implementación del SecurityContext
import org.springframework.security.web.server.context.ServerSecurityContextRepository; // Interfaz para cargar/guardar el SecurityContext en WebFlux
import org.springframework.stereotype.Component; // Indica que esta clase es un bean manejado por Spring
import org.springframework.web.server.ServerWebExchange; // Representa la request y response en WebFlux
import reactor.core.publisher.Mono; // Tipo reactivo que representa un valor futuro
import java.util.Collections; // Para listas vacías

@Component // Marca la clase como un componente Spring (bean)
public class JwtSecurityContextRepository implements ServerSecurityContextRepository {

    private final JwtUtil jwtUtil; // Utilidad para validar y extraer datos del JWT

    // Constructor para inyección de dependencias
    public JwtSecurityContextRepository(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public Mono<SecurityContext> load(ServerWebExchange exchange) {
        // Obtener la cookie "accessToken" de la request
        HttpCookie cookie = exchange.getRequest().getCookies().getFirst("accessToken");

        // Si no existe la cookie, no hay usuario autenticado
        if (cookie == null) {
            System.out.println("No se encontró la cookie accessToken en la request");
            return Mono.empty(); // Retorna vacío indicando que no hay SecurityContext
        }

        // Obtener el valor de la cookie (el JWT)
        String token = cookie.getValue();
        System.out.println("Token recibido en Gateway: " + token);

        // Validar el token
        if (jwtUtil.validateToken(token)) {
            // Extraer los claims (información dentro del token)
            Claims claims = jwtUtil.extractAllClaims(token);
            String username = claims.getSubject(); // Normalmente el username
            System.out.println("Usuario extraído del token: " + username);
            System.out.println("Claims completas: " + claims);

            // Obtener roles del token (si existen)
            var roles = claims.get("roles", java.util.List.class);

            // Crear objeto de autenticación con username y roles
            var auth = new UsernamePasswordAuthenticationToken(
                    username,
                    null, // No necesitamos la contraseña, ya tenemos el token
                    roles != null
                            ? roles.stream()
                                   .map(r -> new org.springframework.security.core.authority.SimpleGrantedAuthority(r.toString()))
                                   .toList() // Convertir roles a GrantedAuthority
                            : Collections.emptyList() // Lista vacía si no hay roles
            );
            System.out.println("Authorities extraídas en Gateway: " + auth.getAuthorities());


            // Retornar el SecurityContext con la autenticación
            return Mono.just(new SecurityContextImpl(auth));
        } else {
            System.out.println("Token inválido o expirado en Gateway"); // Token no válido
        }

        // Si el token no es válido, retornar vacío
        return Mono.empty();
    }

    @Override
    public Mono<Void> save(ServerWebExchange exchange, SecurityContext context) {
        // No se implementa el guardado del SecurityContext porque los JWT son stateless
        throw new UnsupportedOperationException("Unimplemented method 'save'");
    }
}
