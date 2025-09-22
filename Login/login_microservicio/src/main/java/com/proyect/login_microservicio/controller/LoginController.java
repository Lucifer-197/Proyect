package com.proyect.login_microservicio.controller;

import com.proyect.login_microservicio.dto.UsuariosRequest;
import com.proyect.login_microservicio.model.UsuariosModel;
import com.proyect.login_microservicio.service.LoginService;
import com.proyect.login_microservicio.service.UsuariosService;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletResponse;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class LoginController {

    private final LoginService loginService;
    private final UsuariosService usuariosService;

    public LoginController(LoginService loginService, UsuariosService usuariosService) {
        this.loginService = loginService;
        this.usuariosService = usuariosService;
    }

    // -----------------------------
    // LOGIN con cookies HttpOnly
    // -----------------------------
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(
            @RequestBody Map<String, String> loginRequest,
            HttpServletResponse response) {

        String nombreUsuario = loginRequest.get("nombreUsuario");
        String clave = loginRequest.get("clave");

        Optional<UsuariosModel> usuarioOpt = loginService.autenticarUsuario(nombreUsuario, clave);

        return usuarioOpt.map(usuario -> {
            String accessToken = loginService.generarToken(usuario);
            String refreshToken = loginService.generarRefreshToken(usuario);

            // Access Token
            ResponseCookie accessCookie = ResponseCookie.from("accessToken", accessToken)
                    .httpOnly(true)
                    .path("/")
                    .secure(true)       // en prod → true (https)
                    .sameSite("None")    // necesario para cross-origin
                    .maxAge(60 * 15)
                    .build();

            // Refresh Token
            ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", refreshToken)
                    .httpOnly(true)
                    .path("/")
                    .secure(true)       // en prod → true
                    .sameSite("None")    // igual que el accessToken
                    .maxAge(60 * 60 * 24 * 7) // 7 días
                    .build();

            response.addHeader("Set-Cookie", accessCookie.toString());
            response.addHeader("Set-Cookie", refreshCookie.toString());

            return ResponseEntity.ok(Map.of(
                    "message", "Login exitoso",
                    "username", usuario.getNombreUsuario(),
                    "roles", usuario.getRolesModel().getNombreRol()
            ));
        }).orElse(ResponseEntity.status(401)
                .body(Map.of("error", "Credenciales inválidas")));
    }

    // -----------------------------
    // REGISTER
    // -----------------------------
    @PostMapping("/register")
    public ResponseEntity<UsuariosModel> registerUsuario(@RequestBody UsuariosRequest request) {
        UsuariosModel nuevoUsuario = usuariosService.createUsuario(request);
        return ResponseEntity.ok(nuevoUsuario);
    }

    // -----------------------------
    // REFRESH TOKEN
    // -----------------------------
    @PostMapping("/refresh-token")
    public ResponseEntity<Map<String, Object>> refreshToken(
            @CookieValue(value = "refreshToken", required = false) String refreshToken,
            HttpServletResponse response) {

        if (refreshToken == null) {
            return ResponseEntity.status(401).body(Map.of("error", "No se encontró refresh token"));
        }

        String newAccessToken = loginService.validarYGenerarNuevoToken(refreshToken);
        if (newAccessToken == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Refresh token inválido o expirado"));
        }

        ResponseCookie accessCookie = ResponseCookie.from("accessToken", newAccessToken)
                .httpOnly(true)
                .path("/")
                .secure(true)       // en prod → true
                .sameSite("None")
                .maxAge(60 * 15)
                .build();

        response.addHeader("Set-Cookie", accessCookie.toString());

        return ResponseEntity.ok(Map.of("message", "Token renovado"));
    }

    // -----------------------------
    // LOGOUT
    // -----------------------------
    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(HttpServletResponse response) {

        ResponseCookie accessCookie = ResponseCookie.from("accessToken", "")
                .httpOnly(true)
                .path("/")
                .secure(true)
                .sameSite("None")
                .maxAge(0)
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .path("/")
                .secure(true)
                .sameSite("None")
                .maxAge(0)
                .build();

        response.addHeader("Set-Cookie", accessCookie.toString());
        response.addHeader("Set-Cookie", refreshCookie.toString());

        return ResponseEntity.ok(Map.of("message", "Sesión cerrada"));
    }
}
