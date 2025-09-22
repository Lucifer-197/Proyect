package com.proyect.login_microservicio.model;

import jakarta.persistence.*;

@Entity
@Table(name = "roles", uniqueConstraints = {
@UniqueConstraint(columnNames = "nombre_rol") // Restringe que el campo 'nombre' sea único en la tabla
})
public class RolesModel {
     @Id // Identifica el campo como la clave primaria
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Autoincremento del ID desde la base de datos
    private Long idRol;

    @Column(name = "nombre_rol", nullable = false, unique = true) // Campo obligatorio y único
    private String nombreRol;

    @Column(name = "descripcion", nullable = false) // Campo obligatorio
    private String descripcion;

    // Devuelve el ID del rol
    public Long getIdRol() {
        return idRol;
    }

    // Asigna un nuevo ID al rol
    public void setId(Long idRol) {
        this.idRol = idRol;
    }

    // Devuelve el nombre del rol
    public String getNombreRol() {
        return nombreRol;
    }

    // Asigna un nombre al rol
    public void setNombreRol(String nombreRol) {
        this.nombreRol = nombreRol;
    }

    // Devuelve la descripción del rol
    public String getDescripcion() {
        return descripcion;
    }

    // Asigna una descripción al rol
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
}

