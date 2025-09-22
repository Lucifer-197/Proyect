package com.proyect.login_microservicio.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.proyect.login_microservicio.model.RolesModel;
import com.proyect.login_microservicio.repository.RolesRepository;
import com.proyect.login_microservicio.repository.UsuariosRepository;

// Anotación que indica que esta clase es un controlador REST
@RestController
// Define la ruta base para todas las peticiones que maneja este controlador
@RequestMapping("/api/roles")
public class RolesController {
     // Inyección automática del repositorio que maneja la lógica de base de datos para roles
    @Autowired
    private RolesRepository repositoryRol;

    // Método GET para obtener la lista de todos los roles
    @GetMapping
    public List<RolesModel> listarTodos() {
        return repositoryRol.findAll(); // Devuelve todos los roles desde la base de datos
    }

    // Método POST para crear un nuevo rol
    @PostMapping
    public ResponseEntity<?> crear(@RequestBody RolesModel rol) {
        // Validación: el nombre no puede ser nulo ni estar vacío
        if (rol.getNombreRol() == null || rol.getNombreRol().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("El nombre no puede estar vacío");
        }

        // Normaliza el nombre (quita espacios y lo convierte en mayúsculas)
        String nombreNormalizado = rol.getNombreRol().trim().toUpperCase();
        rol.setNombreRol(nombreNormalizado);

        // Validación: la descripción no puede ser nula ni vacía
        if (rol.getDescripcion() == null || rol.getDescripcion().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("La descripción no puede estar vacía");
        }

        // Verifica si el rol con ese nombre ya existe en la base de datos
        if (repositoryRol.findByNombreRol(nombreNormalizado).isPresent()) {
            return ResponseEntity.badRequest().body("El rol ya existe: " + nombreNormalizado);
        }

        // Guarda el nuevo rol en la base de datos y devuelve el objeto creado
        RolesModel nuevoRol = repositoryRol.save(rol);
        return ResponseEntity.ok(nuevoRol);
    }

    // Método GET para obtener un rol por su ID
    @GetMapping("/{id}")
    public ResponseEntity<RolesModel> obtenerPorId(@PathVariable Long id) {
        // Busca el rol por ID. Si existe, lo devuelve con estado 200 OK; si no, devuelve 404 Not Found
        return repositoryRol.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Método PUT para actualizar un rol existente
    @PutMapping("/{id}")
    public ResponseEntity<RolesModel> actualizar(@PathVariable Long id, @RequestBody RolesModel rolDetalles) {
        // Busca el rol por ID. Si existe, actualiza sus valores; si no, devuelve 404 Not Found
        return repositoryRol.findById(id)
                .map(rol -> {
                    // Actualiza los campos nombre y descripción
                    rol.setNombreRol(rolDetalles.getNombreRol());
                    rol.setDescripcion(rolDetalles.getDescripcion());
                    // Guarda los cambios en la base de datos
                    repositoryRol.save(rol);
                    return ResponseEntity.ok(rol);
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
public ResponseEntity<?> eliminar(@PathVariable Long id) {
    return repositoryRol.findById(id)
            .map(rol -> {
                try {
                    repositoryRol.delete(rol);
                    return ResponseEntity.ok("Rol eliminado correctamente");
                } catch (Exception e) {
                    // Captura si hay error por constraint (ejemplo: rol asignado a usuarios)
                    return ResponseEntity.status(409)
                            .body("No se puede eliminar el rol porque está asignado a uno o más usuarios.");
                }
            }).orElse(ResponseEntity.notFound().build());
}

}
    
   
