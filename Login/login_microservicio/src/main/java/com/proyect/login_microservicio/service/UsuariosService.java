package com.proyect.login_microservicio.service;

import java.util.List;

import org.springframework.beans.factory.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.proyect.login_microservicio.dto.UsuariosRequest;
import com.proyect.login_microservicio.model.RolesModel;
import com.proyect.login_microservicio.model.UsuariosModel;
import com.proyect.login_microservicio.repository.RolesRepository;
import com.proyect.login_microservicio.repository.UsuariosRepository;

@Service
public class UsuariosService {
    
    @Autowired // Inyecta el repositorio de usuarios
    private UsuariosRepository usuariosRepository;

    @Autowired // Inyecta el repositorio de roles
    private RolesRepository rolesRepository;

    @Autowired // Inyecta el codificador de contraseñas
    private PasswordEncoder passwordEncoder;

    public List<UsuariosModel> getAllUsuarios() {
        return usuariosRepository.findAll(); // Retorna todos los usuarios
    }

    public UsuariosModel getUsuarioById(Long id) {
        return usuariosRepository.findById(id) // Busca usuario por ID
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado")); // Lanza excepción si no existe
    }

    public UsuariosModel createUsuario(UsuariosRequest request) {
        RolesModel rol = rolesRepository.findById(request.getIdRol()) // Busca el rol por ID
                .orElseThrow(() -> new RuntimeException("Rol no encontrado")); // Lanza excepción si no existe

        UsuariosModel usuario = new UsuariosModel(); // Crea nuevo usuario
        usuario.setNombreUsuario(request.getNombreUsuario()); // Asigna nombre
        usuario.setClave(passwordEncoder.encode(request.getClave())); // Codifica y asigna la clave
        usuario.setRolesModel (rol); // Asigna el rol

        return usuariosRepository.save(usuario); // Guarda el usuario
    }

    public UsuariosModel updateUsuario(Long id, UsuariosRequest request) {
        UsuariosModel usuario = usuariosRepository.findById(id) // Busca usuario por ID
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado")); // Lanza excepción si no existe

        usuario.setNombreUsuario(request.getNombreUsuario()); // Actualiza nombre
        usuario.setClave(passwordEncoder.encode(request.getClave())); // Actualiza y codifica clave

       RolesModel  rol = rolesRepository.findById(request.getIdRol()) // Busca nuevo rol por ID
                .orElseThrow(() -> new RuntimeException("Rol no encontrado")); // Lanza excepción si no existe

        usuario.setRolesModel (rol); // Asigna nuevo rol

        return usuariosRepository.save(usuario); // Guarda cambios
    }

    public void deleteUsuario(Long id) {
        usuariosRepository.deleteById(id); // Elimina usuario por ID
    }
}
