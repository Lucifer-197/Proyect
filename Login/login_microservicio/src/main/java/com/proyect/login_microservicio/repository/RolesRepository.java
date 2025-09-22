package com.proyect.login_microservicio.repository;

import com.proyect.login_microservicio.model.RolesModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RolesRepository extends JpaRepository<RolesModel, Long> {

    // Buscar un rol por su nombre
    Optional<RolesModel> findByNombreRol(String nombreRol);

    // Verificar si un rol existe por nombre
    boolean existsByNombreRol(String nombreRol);
}
