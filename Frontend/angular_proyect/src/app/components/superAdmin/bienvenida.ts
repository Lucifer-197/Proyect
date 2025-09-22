import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-bienvenida',
  standalone: true,
    imports: [CommonModule],  // <-- esto es clave
  template: `
    <div class="container mt-5">

      <!-- Carrusel de bienvenida -->
      <div id="carouselBienvenida" class="carousel slide carousel-fade shadow-lg rounded mb-5" data-bs-ride="carousel">
        
        <!-- Indicadores -->
        <div class="carousel-indicators">
          <button type="button" data-bs-target="#carouselBienvenida" data-bs-slide-to="0" class="active"></button>
          <button type="button" data-bs-target="#carouselBienvenida" data-bs-slide-to="1"></button>
          <button type="button" data-bs-target="#carouselBienvenida" data-bs-slide-to="2"></button>
        </div>

        <!-- Items -->
        <div class="carousel-inner rounded">
          <div class="carousel-item active text-center text-white p-5">
            <h1 class="display-4 fw-bold">¡Bienvenido SuperAdmin!</h1>
            <p class="lead">Aquí podrás gestionar usuarios y administrar el sistema de forma centralizada.</p>
          </div>

          <div class="carousel-item text-center text-white p-5">
            <h2 class="fw-bold">Gestión de Usuarios</h2>
            <p class="lead">En el menú lateral encontrarás las opciones para crear, editar y administrar usuarios.</p>
          </div>

          <div class="carousel-item text-center text-white p-5">
            <h2 class="fw-bold">Administración Segura</h2>
            <p class="lead">Tu cuenta está protegida con autenticación JWT para mayor seguridad en el acceso.</p>
          </div>
        </div>

        <!-- Controles -->
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselBienvenida" data-bs-slide="prev">
          <span class="carousel-control-prev-icon"></span>
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
      max-width: 1000px;
      margin: auto;
    }
    .carousel-item {
      min-height: 400px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      background-color: #252577;
      border-radius: 10px;
    }
    .carousel-item h1, 
    .carousel-item h2 {
      text-shadow: 2px 2px 6px rgba(0,0,0,0.3);
    }
  `]
})
export class Bienvenida {
  cards = [
    { icon: 'bi-file-earmark-text', title: 'Administrar páginas', desc: 'Agrega, edita o elimina las páginas de tu sitio web.' },
    { icon: 'bi-pin', title: 'Administrar blog', desc: 'Agrega, edita o elimina las publicaciones del blog.' },
    { icon: 'bi-chat-dots', title: 'Administrar comentarios', desc: 'Aprueba, edita o elimina los comentarios del blog.' },
    { icon: 'bi-image', title: 'Administrar medios', desc: 'Gestiona los archivos multimedia de tu sitio web.' },
    { icon: 'bi-person', title: 'Administrar usuarios', desc: 'Agrega, edita o elimina usuarios de tu sitio.' },
    { icon: 'bi-life-preserver', title: 'Contactar soporte', desc: 'Si tienes dudas, ponte en contacto con soporte.' }
  ];
}
