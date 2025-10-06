import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-bienvenida',
  standalone: true,
    imports: [CommonModule],  // <-- esto es clave
  template: `
    <div class="container mt-5">

      <!-- Carrusel de bienvenida -->
      <div id="carouselBienvenida" class="carousel slide carousel-fade shadow-lg  mb-5" data-bs-ride="carousel">
        
        <!-- Indicadores -->
        <div class="carousel-indicators">
          <button type="button" data-bs-target="#carouselBienvenida" data-bs-slide-to="0" class="active"></button>
          <button type="button" data-bs-target="#carouselBienvenida" data-bs-slide-to="1"></button>
          <button type="button" data-bs-target="#carouselBienvenida" data-bs-slide-to="2"></button>
        </div>

        <!-- Items -->
        <div class="carousel-inner">
          <div class="carousel-item active text-center text-white p-5"  [ngStyle]="{'background-image': 'url(assets/slider1.jpg)'}">
            <h1 class="display-4 fw-bold">¡Bienvenido SuperAdmin!</h1>
            <p class="lead">Aquí podrás gestionar usuarios y administrar el sistema de forma centralizada.</p>
          </div>

          <div class="carousel-item text-center text-white p-5"  [ngStyle]="{'background-image': 'url(assets/slider2.jpg)'}">
            <h2 class="fw-bold">Gestión de Usuarios</h2>
            <p class="lead">En el menú lateral encontrarás las opciones para crear, editar y administrar usuarios.</p>
          </div>

          <div class="carousel-item text-center text-white p-5"  [ngStyle]="{'background-image': 'url(assets/slider3.jpg)'}">
            <h2 class="fw-bold">Administración Segura</h2>
            <p class="lead">Tu cuenta está protegida con autenticación JWT para mayor seguridad en el acceso.</p>
          </div>
        </div>

        <!-- Controles -->
        <button class="carousel-control-prev " type="button" data-bs-target="#carouselBienvenida" data-bs-slide="prev">
          <span class="carousel-control-prev-icon "></span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselBienvenida" data-bs-slide="next">
          <span class="carousel-control-next-icon"></span>
        </button>
      </div>

      <!-- Cards de funciones -->
      <div class="row g-4">
        <div class="col-md-4" *ngFor="let card of cards">
          <div class="card text-center h-100 shadow-sm p-3">
            <i class="bi" [ngClass]="card.icon" style="font-size: 2rem; color: #252577;"></i>
            <h5 class="mt-3">{{ card.title }}</h5>
            <p class="text-muted">{{ card.desc }}</p>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .carousel {
      max-width: 800px;
      margin: auto;
    }
 .carousel-item {
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-size: cover;       /* ajusta la imagen al tamaño del slide */
  background-position: center;  /* centra la imagen */
  position: relative;           /* necesario para overlay */
  color: white;
}
.carousel-item::before {
  content: "";
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.4); /* semi-transparente */
 background: linear-gradient(
    rgba(3, 3, 71, 0.69),   /* azul oscuro translúcido */
    rgba(12, 10, 41, 0.52)     /* negro suave */
  );
  z-index: 0;
}

.carousel-item > h1,
.carousel-item > h2,
.carousel-item > p {
  position: relative;
  z-index: 1;
  text-shadow: 2px 2px 6px rgba(0,0,0,0.3);
}

      .carousel-control-prev {
  left: -40px; /* mueve el botón hacia la izquierda */
}

.carousel-control-next {
  right: -40px; /* mueve el botón hacia la derecha */
}
      
  `]
})
export class Bienvenida {
  cards = [
    { 
  icon: 'bi-file-earmark-text', 
  title: 'Administrar herramientas', 
  desc: 'Agrega, edita o elimina las herramientas de tu inventario.' 
},
{ 
  icon: 'bi-pin', 
  title: 'Administrar categorías', 
  desc: 'Crea y organiza las categorías y subcategorías de herramientas.' 
},
{ 
  icon: 'bi-chat-dots', 
  title: 'Registrar mantenimientos', 
  desc: 'Registra mantenimientos y revisiones de cada herramienta.' 
},
{ 
  icon: 'bi-image', 
  title: 'Administrar imágenes', 
  desc: 'Agrega o actualiza imágenes de las herramientas para identificarlas fácilmente.' 
},
{ 
  icon: 'bi-person', 
  title: 'Administrar usuarios', 
  desc: 'Gestiona los usuarios que tienen acceso al sistema.' 
},
{ 
  icon: 'bi-shield-lock', 
  title: 'Administrar roles', 
  desc: 'Define roles y permisos para controlar el acceso de los usuarios al sistema.' 
}

  ];
}
