package com.proyect.login_microservicio.dto;


// Clase que representa la respuesta del login (cuando el usuario inicia sesión y recibe un token)
public class LoginResponse {

    // Atributo privado donde se almacenará el token JWT generado al iniciar sesión
    private String token;

    // Constructor que permite crear un objeto LoginResponse con el token ya asignado
    public LoginResponse(String token) {
        this.token = token;
    }

    // Método getter para obtener el token actual almacenado en el objeto
    public String getToken() { 
        return token; 
    }

    // Método setter para cambiar el valor del token (no suele usarse, pero está ahí por si acaso)
    public void setToken(String token) { 
        this.token = token; 
    }
}
