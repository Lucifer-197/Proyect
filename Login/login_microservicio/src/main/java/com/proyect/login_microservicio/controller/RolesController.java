package com.proyect.login_microservicio.controller;

import com.proyect.login_microservicio.model.RolesModel;
import com.proyect.login_microservicio.service.RolesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RolesController {

    @Autowired
    private RolesService rolesService;

    // ✅ Listar todos los roles
    @GetMapping
    public List<RolesModel> listarTodos() {
        return rolesService.listarTodos();
    }

    // ✅ Obtener un rol por ID
    @GetMapping("/{id}")
    public ResponseEntity<RolesModel> obtenerPorId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(rolesService.obtenerPorId(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ✅ Crear un nuevo rol
    @PostMapping
    public ResponseEntity<?> crear(@RequestBody RolesModel rol) {
        try {
            return ResponseEntity.ok(rolesService.crearRol(rol));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ✅ Actualizar un rol existente
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody RolesModel rolDetalles) {
        try {
            return ResponseEntity.ok(rolesService.actualizarRol(id, rolDetalles));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ✅ Eliminar un rol
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            rolesService.eliminarRol(id);
            return ResponseEntity.noContent().build(); // 204 No Content
        } catch (RuntimeException e) {
            return ResponseEntity.status(409).body(e.getMessage());
        }
    }
}
