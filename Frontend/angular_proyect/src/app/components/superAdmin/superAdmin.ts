import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-superadmin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './superAdmin.html',
})

export class SuperAdmin {
  sidebarVisible = false; // Controla si la barra lateral esta visible o no
  nombreUsuario: string | null = null; // Guarda el nombre del usuario
  rolUsuario: string | null = null; // Guarda el rol
  // Controlar los submenus
  submenuGestion = false;
  submenuInventario = false;
  isMobile = false; // Indicador si la vista es movil

  // Inyectar servicio
  constructor(private auth: AuthService) { }

  /* Inicializa valores, busca en el almacenamiento local del 
  navegador y lo guarda en la variable nombreUsuario */

  ngOnInit() {
    this.nombreUsuario = localStorage.getItem('nombreUsuario') ?? 'Invitado'; // Busca en el localStorage si existe lo asigna a la variable
    this.rolUsuario = localStorage.getItem('rol') ?? 'Sin rol'; // si existe la clave rol guarda ese valor
    this.isMobile = window.innerWidth < 768; // Maneja el ancho de la ventana del
  }

  /* Se encarga de abrir y cerra el sidebar
  y los submenus*/

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible; // Cambia el valor del sidebaVisisble
    this.submenuGestion = false;
    this.submenuInventario = false;
  }

  /* Cambia el true a false, si esta cerrado false y abierto true*/

  toggleSubMenuGestion() { // Mostrar el menus de gestion de usuarios
    this.submenuGestion = !this.submenuGestion;
  }

  toggleSubMenuInventario() {  // Mostrar el menus de gestion de mantenimiento
    this.submenuInventario = !this.submenuInventario;
  }

  /* Cuando s hace click en u enlace de navegcionsi el usuario está en móvil
   la sidebar se cierra automáticamente para dar más espacio a la vista principal.*/
  handleNavClick() {
    if (this.isMobile) {
      this.sidebarVisible = false;
    }
  }

  /* Este metodod se encarga de cerrar sesion de usuario */

  logout() {
    this.auth.logout(); // Llama al servicio para cerra sesion
  }
}
