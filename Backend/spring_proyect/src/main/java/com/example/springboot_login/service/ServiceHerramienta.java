package com.example.springboot_login.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.springboot_login.model.ModelHerramienta;
import com.example.springboot_login.repository.RepositoryHerramienta;

// Encapsula la lógica de negocio relacionada con la entidad "Herramienta"
@Service
public class ServiceHerramienta {

    // Inyecta automáticamente el repositorio de herramienta para acceder a la base de datos
    @Autowired
    private RepositoryHerramienta repositoryHerramienta;

    // Retorna una lista con todas las herramientas almacenadas en la base de datos
    public List<ModelHerramienta> listar() {
        return repositoryHerramienta.findAllByOrderByIdHerramientaDesc();
    }

    // Busca y devuelve una herramienta por su ID; si no existe, retorna null
    public ModelHerramienta obtenerPorId(Long id) {
        return repositoryHerramienta.findById(id).orElse(null);
    }

    // Guarda una nueva herramienta o actualiza una existente si ya tiene ID
    public ModelHerramienta guardar(ModelHerramienta herramienta) {
        return repositoryHerramienta.save(herramienta);
    }

    // Elimina una herramienta de la base de datos a partir de su ID
    public void eliminar(Long id) {
        repositoryHerramienta.deleteById(id);
    }
    public List<ModelHerramienta> buscarHerramientas(String filtro) {
        return repositoryHerramienta.buscarPorFiltro(filtro);
    }
}
