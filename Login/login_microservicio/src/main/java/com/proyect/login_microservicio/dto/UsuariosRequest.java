package com.proyect.login_microservicio.dto;

// Importamos validaciones de Jakarta para asegurar que los campos no estén vacíos o nulos
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

// Esta clase representa el objeto que se enviará desde el cliente cuando se cree o actualice un usuario
public class UsuariosRequest {

    // Campo obligatorio: no puede ser nulo ni estar vacío
    @NotBlank(message = "El nombre de usuario no puede estar vacío")
    private String nombreUsuario;

    // Campo obligatorio: no puede ser nulo ni estar vacío
    @NotBlank(message = "La clave no puede estar vacía")
    private String clave;

    // Campo obligatorio: se debe indicar el ID del rol (por ejemplo, 1 = admin, 2 = user, etc.)
    @NotNull(message = "El ID del rol no puede ser nulo")
    private Long idRol;

    // Getters y Setters

    // Retorna el nombre de usuario
    public String getNombreUsuario() { return nombreUsuario; }

    // Asigna el nombre de usuario
    public void setNombreUsuario(String nombreUsuario) { this.nombreUsuario = nombreUsuario; }

    // Retorna la clave (contraseña)
    public String getClave() { return clave; }

    // Asigna la clave (contraseña)
    public void setClave(String clave) { this.clave = clave; }

    // Retorna el ID del rol
    public Long getIdRol() { return idRol; }

    // Asigna el ID del rol
    public void setIdRol(Long idRol) { this.idRol = idRol; }
}
