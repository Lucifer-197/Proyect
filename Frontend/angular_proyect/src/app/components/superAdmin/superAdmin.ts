// Importaciones básicas de Angular
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
  sidebarVisible = false;
  nombreUsuario: string | null = null;
  submenuGestion = false;
  submenuInventario = false;
  isMobile = false;

  // ✅ Inyectamos el servicio en el constructor
  constructor(private auth: AuthService) {}

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
    this.submenuGestion = false;
    this.submenuInventario = false;
  }

  toggleSubMenuGestion() {
    this.submenuGestion = !this.submenuGestion;
  }

  toggleSubMenuInventario() {
    this.submenuInventario = !this.submenuInventario;
  }

  handleNavClick() {
    if (this.isMobile) {
      this.sidebarVisible = false;
    }
  }

  ngOnInit() {
    this.nombreUsuario = localStorage.getItem('nombreUsuario') ?? 'Invitado';
    this.isMobile = window.innerWidth < 768;
  }

  // ✅ Ahora sí funciona porque "auth" está en el constructor
  logout() {
    this.auth.logout();
  }
}
