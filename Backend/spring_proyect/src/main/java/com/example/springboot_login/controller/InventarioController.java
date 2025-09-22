package com.example.springboot_login.controller;

import com.example.springboot_login.model.ModelHerramienta;
import com.example.springboot_login.service.ServiceHerramienta;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventario")
public class InventarioController {

    @Autowired
    private ServiceHerramienta serviceHerramienta;

    // 🔹 Listar todo el inventario (todas las herramientas registradas)
    @GetMapping
    public List<ModelHerramienta> listarInventario() {
        return serviceHerramienta.listar();
    }
}
