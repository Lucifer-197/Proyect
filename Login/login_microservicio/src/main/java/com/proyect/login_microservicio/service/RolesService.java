package com.proyect.login_microservicio.service;

import com.proyect.login_microservicio.model.RolesModel;
import com.proyect.login_microservicio.repository.RolesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class RolesService {

    @Autowired
    private RolesRepository rolesRepository;

    // Listar todos los roles (ordenados de más reciente a más antiguo)
    public List<RolesModel> listarTodos() {
        return rolesRepository.findAllByOrderByIdRolDesc();
    }

    // Buscar un rol por ID
    public RolesModel obtenerPorId(Long id) {
        return rolesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
    }

    // Crear un nuevo rol
    public RolesModel crearRol(RolesModel rol) {
        // Normalizar el nombre (mayúsculas y sin espacios extra)
        String nombreNormalizado = rol.getNombreRol().trim().toUpperCase();
        rol.setNombreRol(nombreNormalizado);

        // Validaciones
        if (rol.getDescripcion() == null || rol.getDescripcion().trim().isEmpty()) {
            throw new RuntimeException("La descripción no puede estar vacía");
        }

        if (rolesRepository.existsByNombreRol(nombreNormalizado)) {
            throw new RuntimeException("El rol ya existe: " + nombreNormalizado);
        }

        return rolesRepository.save(rol);
    }

    // Actualizar un rol existente
    public RolesModel actualizarRol(Long id, RolesModel rolDetalles) {
        RolesModel rol = rolesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));

        rol.setNombreRol(rolDetalles.getNombreRol().trim().toUpperCase());
        rol.setDescripcion(rolDetalles.getDescripcion());

        return rolesRepository.save(rol);
    }

    // Eliminar un rol
    public void eliminarRol(Long id) {
        RolesModel rol = rolesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
        rolesRepository.delete(rol);
    }
}
