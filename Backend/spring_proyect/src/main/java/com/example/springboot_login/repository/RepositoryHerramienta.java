package com.example.springboot_login.repository;
import java.util.List;


import org.springframework.data.jpa.repository.JpaRepository;
import com.example.springboot_login.model.ModelHerramienta;

public interface RepositoryHerramienta extends JpaRepository<ModelHerramienta, Long> {

       List<ModelHerramienta> findByCodigoStartingWithOrderByCodigoDesc(String prefix);
}
