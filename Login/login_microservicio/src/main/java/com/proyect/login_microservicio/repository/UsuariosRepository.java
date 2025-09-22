package com.proyect.login_microservicio.repository;

import com.proyect.login_microservicio.model.UsuariosModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuariosRepository extends JpaRepository<UsuariosModel, Long> {

    // Buscar un usuario por su nombre de usuario
    Optional<UsuariosModel> findByNombreUsuario(String nombreUsuario);

    // Verificar si un usuario existe por nombre de usuario
    boolean existsByNombreUsuario(String nombreUsuario);
}
