package com.proyect.login_microservicio.repository;

import com.proyect.login_microservicio.model.UsuariosModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuariosRepository extends JpaRepository<UsuariosModel, Long> {

    // Buscar un usuario por su nombre de usuario
    Optional<UsuariosModel> findByNombreUsuario(String nombreUsuario);

    // Verificar si un usuario existe por nombre de usuario
    boolean existsByNombreUsuario(String nombreUsuario);

    //Filtarr usuarios por nombre y rol excliyendo el superadmin
   @Query("SELECT u FROM UsuariosModel u LEFT JOIN u.rolesmodel r " +
       "WHERE (LOWER(u.nombreUsuario) LIKE LOWER(CONCAT('%', :filtro, '%')) " +
       "OR LOWER(r.nombreRol) LIKE LOWER(CONCAT('%', :filtro, '%'))) " +
       "AND r.nombreRol <> 'SUPER_ADMIN'")
List<UsuariosModel> buscarPorFiltro(@Param("filtro") String filtro);

List<UsuariosModel> findAllByOrderByIdUsuariosDesc();



}
