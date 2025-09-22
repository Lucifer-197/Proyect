package com.proyect.login_microservicio.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
  @Table(name = "usuarios")
public class UsuariosModel {
  
    @Id // Indica que este campo es la clave primaria
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Genera automáticamente el ID (autoincremental)
    private Long idUsuarios; // Tipo Long para manejar valores grandes y autoincrementables

    @Column(name = "nombre_usuario", nullable = false) // Columna obligatoria para el nombre del usuario
    private String nombreUsuario;

    @Column(name = "clave", nullable = false) // Columna obligatoria para la clave del usuario
    private String clave;

    @ManyToOne(fetch = FetchType.EAGER) // Muchos usuarios pueden tener un solo rol (relación muchos a uno)
    @JoinColumn(name = "id_rol") // Llave foránea que hace referencia al ID del rol
    private RolesModel rolesmodel;

    // Devuelve el ID del usuario
    public Long getIdUsuarios() {
        return idUsuarios;
    }

    // Asigna un valor al ID del usuario
    public void setIdUsuarios(Long idUsuarios) {
        this.idUsuarios = idUsuarios;
    }

    // Devuelve el nombre del usuario
    public String getNombreUsuario() {
        return nombreUsuario;
    }

    // Asigna un nombre al usuario
    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }

    // Devuelve la clave del usuario
    public String getClave() {
        return clave;
    }

    // Asigna una clave al usuario
    public void setClave(String clave) {
        this.clave = clave;
    }

    // Devuelve el rol asignado al usuario
    public RolesModel getRolesModel() {
        return rolesmodel;
    }

    // Asigna un rol al usuario
    public void setRolesModel(RolesModel rolesmodel) {
        this.rolesmodel = rolesmodel;
    }

 @JsonIgnore
    public boolean isActivo() {
        return false; // valor por defecto
    }
}

