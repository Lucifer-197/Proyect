/* Componente de Login que se encarga de limpiar el
estado al iniciar, valida que se llenes los campos
llama al servicio para autenticar si es exitoso guarda los datos definfe el rol y redirige
si falla muestra error */

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

  constructor(private auth: AuthService, private router: Router) { }

  /* Cuando carga el componente  */

// ngOnInit() {
//   if (this.auth.isLoggedIn()) {
//     // Si ya hay sesión activa, redirigir según el rol
//     const rol = localStorage.getItem('rol');
//     if (rol === 'SUPER_ADMIN') {
//       this.router.navigate(['/superadmin']);
//     } else {
//       this.router.navigate(['/home']);
//     }
//   }
// }
  ngOnInit() {
    this.auth.setLoggedIn(false); // Marca al usuario como no autenticado
    localStorage.removeItem('rol'); // Borra cualquier rol guardado
  }

  /* Cuando el usuario se loguea */
  onLogin() {
    this.submitted = true; // Marca que el formulario fue enviado
    this.errorMessage = ''; // Limpia de mensajes de error anteriores

    // Validación de los campos
    if (!this.nombreUsuario || !this.clave) {
      this.errorMessage = 'Todos los campos son obligatorios';
      return;
    }
     // llama al servicio si es correcto entra al next
    this.auth.login(this.nombreUsuario, this.clave).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);

        // Guarda nombre de usuario y rol y redirje dependiendo del rol
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

        // Manejo  de errores
        if (err.status === 0) {
          // No hay conexión con el servidor
          this.errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión.';
        } else if (err.status === 401 || err.status === 403) {
          // Credenciales inválidas
          this.errorMessage = 'Usuario o contraseña incorrectos.';
        } else if (err.status >= 500) {
          // Error del servidor
          this.errorMessage = 'Error interno del servidor. Intenta más tarde.';
        } else if (err.error?.message) {
          // Mensaje específico del backend
          this.errorMessage = err.error.message;
        } else {
          // Error genérico
          this.errorMessage = 'Ocurrió un error inesperado. Intenta nuevamente.';
        }
      },
    });
  }

}
