// Importaciones necesarias desde Angular
import { Component, OnInit } from '@angular/core';
// Servicio personalizado para consumir API de herramientas
import { HerramientaService } from '../../services/herramienta';
// Para manipular contenido seguro en Angular, como URLs de imágenes
import { DomSanitizer } from '@angular/platform-browser';
// Módulos para formularios y funcionalidades comunes
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// Para poder usar rutas en la plantilla
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-inventario',               // Nombre del selector del componente
  templateUrl: './inventario.html',         // Ruta al archivo HTML que renderiza este componente
  imports: [FormsModule, CommonModule, RouterLink] // Módulos que este componente necesita 
})
export class Inventario implements OnInit {
  // Lista de herramientas que se mostrarán en la vista
  herramientas: any[] = [];

  // Variable para guardar la herramienta seleccionada al hacer clic (para mostrar en modal o detalle)
  herramientaSeleccionada: any = null;

  // Constructor con inyección de dependencias: el servicio para traer datos y el sanitizer para las URLs
  constructor(
    private herramientaService: HerramientaService,
    private sanitizer: DomSanitizer
  ) {}

  // ngOnInit se ejecuta al inicializar el componente
  ngOnInit() {
    // Llama al método `listar()` del servicio para obtener las herramientas desde el backend
    this.herramientaService.listar().subscribe(data => {
      // Asigna los datos recibidos a la variable herramientas
      this.herramientas = data;
    });
  }

  // Al hacer clic en "visualizar", se guarda la herramienta seleccionada para mostrarla en el modal o detalles
  visualizar(herramienta: any) {
    this.herramientaSeleccionada = herramienta;
  }

  // Cierra el modal o limpia la selección
  cerrarModal() {
    this.herramientaSeleccionada = null;
  }

  // Devuelve la URL completa de la imagen que se va a mostrar desde el backend (carpeta uploads)
  getImagenUrl(nombreArchivo: string) {
  return `http://localhost:8080/api/herramientas/uploads/${nombreArchivo}`;
  }
}
