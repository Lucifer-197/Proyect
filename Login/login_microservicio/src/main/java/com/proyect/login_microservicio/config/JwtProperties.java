package com.proyect.login_microservicio.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration // Marca esta clase como parte de la configuración de Spring.
@ConfigurationProperties(prefix = "jwt") // Toma valores de application.yml que empiecen con "jwt."
public class JwtProperties {

    // Clave para firmar y validar los tokens de acceso
    private String secret;

    //Clave diferente para firmar y validar los tokens de refresh
    private String refreshSecret;

    // Tiempo de expiración del token de acceso (en milisegundos)
    private long expirationMs;

    // Tiempo de expiración del token de refresh (en milisegundos)
    private long refreshExpirationMs;

    // Getters y setters necesarios para que Spring pueda asignar los valores
    public String getSecret() { return secret; }
    public void setSecret(String secret) { this.secret = secret; }

    public String getRefreshSecret() { return refreshSecret; }
    public void setRefreshSecret(String refreshSecret) { this.refreshSecret = refreshSecret; }

    public long getExpirationMs() { return expirationMs; }
    public void setExpirationMs(long expirationMs) { this.expirationMs = expirationMs; }

    public long getRefreshExpirationMs() { return refreshExpirationMs; }
    public void setRefreshExpirationMs(long refreshExpirationMs) { this.refreshExpirationMs = refreshExpirationMs; }
}

