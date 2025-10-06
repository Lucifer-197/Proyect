package com.example.springboot_login.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.example.springboot_login.model.ModelHerramienta;

public interface RepositoryHerramienta extends JpaRepository<ModelHerramienta, Long> {

       List<ModelHerramienta> findByCodigoStartingWithOrderByCodigo(String prefix);

      @Query("SELECT h FROM ModelHerramienta h WHERE " +
       "LOWER(h.nombre) LIKE LOWER(CONCAT('%', :filtro, '%')) OR " +
       "LOWER(h.categoria) LIKE LOWER(CONCAT('%', :filtro, '%'))")
List<ModelHerramienta> buscarPorFiltro(String filtro);
 List<ModelHerramienta> findAllByOrderByIdHerramientaDesc();

}
