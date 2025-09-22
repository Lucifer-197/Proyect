import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'], 
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class Login {
  nombreUsuario: string = '';
  clave: string = '';
  submitted: boolean = false;
  errorMessage: string = '';

  constructor(private auth: AuthService, private router: Router) {}

ngOnInit() {
  this.auth.setLoggedIn(false);
  localStorage.removeItem('rol');
}

onLogin() {
  this.submitted = true;
  this.errorMessage = '';

  // 🔹 Validación local
  if (!this.nombreUsuario || !this.clave) {
    this.errorMessage = 'Todos los campos son obligatorios';
    return;
  }

  this.auth.login(this.nombreUsuario, this.clave).subscribe({
    next: (response) => {
      console.log('Login exitoso:', response);

      // 🔹 Guardar nombre de usuario y rol
      localStorage.setItem('nombreUsuario', this.nombreUsuario);
      const roles: string[] = response.roles || [];

      if (roles.includes('SUPER_ADMIN')) {
        this.auth.setCurrentRol('SUPER_ADMIN');
        localStorage.setItem('rol', 'SUPER_ADMIN');
        this.router.navigate(['/superadmin']);
      } else {
        const rol = roles[0] || 'USER';
        this.auth.setCurrentRol(rol);
        localStorage.setItem('rol', rol);
        this.router.navigate(['/home']);
      }
    },
    error: (err) => {
      console.error('Error en login:', err);

      // 🔹 Manejo diferenciado de errores
      if (err.status === 0) {
        // 🔹 No hay conexión con el servidor
        this.errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión.';
      } else if (err.status === 401 || err.status === 403) {
        // 🔹 Credenciales inválidas
        this.errorMessage = 'Usuario o contraseña incorrectos.';
      } else if (err.status >= 500) {
        // 🔹 Error del servidor
        this.errorMessage = 'Error interno del servidor. Intenta más tarde.';
      } else if (err.error?.message) {
        // 🔹 Mensaje específico del backend
        this.errorMessage = err.error.message;
      } else {
        // 🔹 Error genérico
        this.errorMessage = 'Ocurrió un error inesperado. Intenta nuevamente.';
      }
    },
  });
}

}
