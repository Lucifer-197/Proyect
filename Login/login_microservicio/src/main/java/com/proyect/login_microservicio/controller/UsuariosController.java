package com.proyect.login_microservicio.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.proyect.login_microservicio.dto.UsuariosRequest;
import com.proyect.login_microservicio.model.UsuariosModel;
import com.proyect.login_microservicio.repository.UsuariosRepository;
import com.proyect.login_microservicio.service.UsuariosService;

import jakarta.validation.Valid;

// Esta clase es un controlador REST (maneja peticiones HTTP)
@RestController

// Define la ruta base del controlador: todo lo que comience con /api/usuarios será manejado aquí
@RequestMapping("/api/usuarios")
public class UsuariosController {
    
    @Autowired
    private UsuariosService usuarioService;


    // Retorna una lista de todos los usuarios registrados
    @GetMapping
    public List<UsuariosModel> getAllUsuarios() {
        return usuarioService.getAllUsuarios();
    }

    // Maneja las peticiones GET a /api/usuarios/{id}
    // Busca un usuario por su ID
    @GetMapping("/{id}")
    public UsuariosModel getUsuarioById(@PathVariable Long id) {
        return usuarioService.getUsuarioById(id);
    }

    // Maneja las peticiones POST a /api/usuarios
    // Crea un nuevo usuario usando el cuerpo de la petición
    @PostMapping
    public UsuariosModel createUsuario(@Valid @RequestBody UsuariosRequest request) {
        return usuarioService.createUsuario(request);
    }

    // Maneja las peticiones PUT a /api/usuarios/{id}
    // Actualiza los datos de un usuario específico por su ID
    @PutMapping("/{id}")
    public UsuariosModel updateUsuario(@PathVariable Long id, @Valid @RequestBody UsuariosRequest request) {
        return usuarioService.updateUsuario(id, request);
    }

    // Maneja las peticiones DELETE a /api/usuarios/{id}
    // Elimina un usuario por su ID
    @DeleteMapping("/{id}")
    public void deleteUsuario(@PathVariable Long id) {
        usuarioService.deleteUsuario(id);
    }
@GetMapping("/buscar")
public List<UsuariosModel> buscar(@RequestParam String filtro) {
    return usuarioService.buscarUsuarios(filtro);
}


}
