package com.proyect.login_microservicio.service;

import com.proyect.login_microservicio.config.JwtProperties;
import com.proyect.login_microservicio.model.UsuariosModel;
import com.proyect.login_microservicio.repository.UsuariosRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Date;
import java.util.Optional;

@Service
public class LoginService {

    private final UsuariosRepository usuariosRepository;
    private final JwtProperties jwtProperties;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public LoginService(UsuariosRepository usuariosRepository, JwtProperties jwtProperties) {
        this.usuariosRepository = usuariosRepository;
        this.jwtProperties = jwtProperties;
    }

    // 🔹 Encriptar password
    public String encriptarPassword(String password) {
        return passwordEncoder.encode(password);
    }

    public boolean validarPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    // 🔹 Registro de usuario
    public UsuariosModel registrarUsuario(UsuariosModel usuario) {
        usuario.setClave(encriptarPassword(usuario.getClave()));
        return usuariosRepository.save(usuario);
    }

    // 🔹 Login
    public Optional<UsuariosModel> autenticarUsuario(String nombreUsuario, String password) {
        Optional<UsuariosModel> usuarioOpt = usuariosRepository.findByNombreUsuario(nombreUsuario);
        if (usuarioOpt.isPresent() && validarPassword(password, usuarioOpt.get().getClave())) {
            return usuarioOpt;
        }
        return Optional.empty();
    }

    // Generar Access Token (con rol y username)
public String generarToken(UsuariosModel usuario) {
    return Jwts.builder()
            .setSubject(usuario.getNombreUsuario()) // username en subject
.claim("roles", Collections.singletonList(usuario.getRolesModel().getNombreRol()))
            .claim("username", usuario.getNombreUsuario()) // nombre explícito
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + jwtProperties.getExpirationMs()))
            .signWith(SignatureAlgorithm.HS256, jwtProperties.getSecret().getBytes())
            .compact();
}


    //Generar Refresh Token (solo username en subject)
    public String generarRefreshToken(UsuariosModel usuario) {
        return Jwts.builder()
                .setSubject(usuario.getNombreUsuario())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtProperties.getRefreshExpirationMs()))
                .signWith(SignatureAlgorithm.HS256, jwtProperties.getRefreshSecret().getBytes())
                .compact();
    }

    // Validar refresh token y generar nuevo access token
    public String validarYGenerarNuevoToken(String refreshToken) {
        try {
            var claims = Jwts.parser()
                    .setSigningKey(jwtProperties.getRefreshSecret().getBytes())
                    .parseClaimsJws(refreshToken)
                    .getBody();

            if (claims.getExpiration().after(new Date())) {
                String username = claims.getSubject();

                Optional<UsuariosModel> usuarioOpt = usuariosRepository.findByNombreUsuario(username);
                if (usuarioOpt.isPresent()) {
                    return generarToken(usuarioOpt.get()); // Nuevo Access Token con rol y username
                }
            }
        } catch (Exception e) {
            return null; // token inválido o expirado
        }
        return null;
    }
}
