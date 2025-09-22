// Importaciones necesarias desde Angular y servicios personalizados
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth'; // Servicio de autenticación personalizado
import { Router, NavigationStart } from '@angular/router'; // Para controlar navegación y detectar cambios de ruta

// Decorador que define este componente
@Component({
  selector: 'app-home',             // Nombre del selector del componente
  templateUrl: './home.html',       // Archivo de plantilla HTML asociado
})
export class Home implements OnInit { // Componente llamado "Home" que implementa OnInit
  // Variables que se usarán para mostrar datos del usuario
  rol: string | null = null;         // Rol actual del usuario (Instructor, Aprendiz, etc.)
  nombreUsuario: string = '';        // Nombre que se muestra en la vista

  // Inyección de dependencias: servicio de autenticación y el router
  constructor(private auth: AuthService, private router: Router) {}

  // Método que se ejecuta automáticamente al iniciar el componente
  ngOnInit() {
    console.log('ngOnInit: revisando token al cargar home');
    this.checkToken(); // Verifica si hay un token válido al iniciar

    // Se suscribe a los eventos de navegación (cuando se cambia de ruta)
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        console.log('NavigationStart detectado, comprobando token');
        this.checkToken(); // Cada vez que se navega, se vuelve a verificar el token
      }
    });
  }

  // Función que verifica si el usuario sigue autenticado
  checkToken() {
    const tieneToken = this.auth.isLoggedIn(); // Verifica si hay token en localStorage o en cookies
    console.log('checkToken → tieneToken:', tieneToken);

    // Si NO hay token, redirige al login
    if (!tieneToken) {
      console.log('No hay token → redirigiendo al login borrando historial');
      // `window.location.replace` redirige a /login y elimina la ruta actual del historial
      window.location.replace('/login');
    } else {
      console.log('Token existe → mostrando datos');
      // Si el token existe, recupera nombre y rol del usuario para mostrarlos en la vista
      this.nombreUsuario = localStorage.getItem('nombreUsuario') || '';
      this.rol = this.auth.getCurrentRol(); // Método que devuelve el rol actual
    }
  }

  // Función para cerrar sesión
logout() {
  this.auth.logout(); 
}

}
