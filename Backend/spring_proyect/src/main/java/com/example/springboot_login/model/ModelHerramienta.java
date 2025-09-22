
// Paquete donde se encuentra la clase (normalmente las entidades JPA van en un paquete llamado 'model')
package com.example.springboot_login.model;

import jakarta.persistence.*;

// -----------------------------------------
// Esta clase representa una ENTIDAD JPA mapeada a una tabla llamada "herramientas" en la base de datos.
// -----------------------------------------
@Entity
@Table(name = "herramientas")
public class ModelHerramienta {

    @Id //Indica que es la llave primaria pk
    @GeneratedValue(strategy = GenerationType.IDENTITY) //Genera automaticamente la pk (autoincremental)
    private Long id_herramienta;

    // Máquina (nombre principal)
    @Column(name = "maquina", nullable = false, unique= true)
    private String maquina;

    // Categoría de la herramienta
    @Column(name = "categoria", nullable = false)
    private String categoria;

    // Modelo
    @Column(name = "modelo", nullable = true)
    private String modelo;

    // Serie
    @Column(name = "serie", nullable = true)
    private String serie;

    // Marca
    @Column(name = "marca", nullable = true)
    private String marca;

    // Código (puede generarse automáticamente o asignarse)
    @Column(name = "codigo", nullable = false, unique = true)
    private String codigo;

    // Color
    @Column(name = "color", nullable = true)
    private String color;

    // Ubicación
    @Column(name = "ubicacion", nullable = true)
    private String ubicacion;

    // Imagen (se guarda como nombre o URL del archivo)
    @Column(name = "imagen", nullable = true)
    private String imagen;

    // Getters y Setters

    public Long getId_herramienta() {
        return id_herramienta;
    }

    public void setId_herramienta(Long id_herramienta) {
        this.id_herramienta = id_herramienta;
    }

    public String getMaquina() {
        return maquina;
    }

    public void setMaquina(String maquina) {
        this.maquina = maquina;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public String getSerie() {
        return serie;
    }

    public void setSerie(String serie) {
        this.serie = serie;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getUbicacion() {
        return ubicacion;
    }

    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }

    public String getImagen() {
        return imagen;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }
}
