// Importamos el tipo 'Routes' que define las rutas en Angular.
import { Routes } from '@angular/router';

// Importamos todos los componentes que se van a usar en las rutas.
import { Login } from './components/login/login';
import { SuperAdmin } from './components/superAdmin/superAdmin';
import { Home } from './components/home/home';
import { AuthGuard } from './guards/guard'; // Este es el guardia que impide el acceso sin autorización.
import { RolLista } from './components/rol/rolLista';
import { RolCrear } from './components/rol/rolCrear';
import { UsuarioCrear } from './components/usuarios/usuarioCrear';
import { UsuarioLista } from './components/usuarios/usuarioLista';
import { Bienvenida } from './components/superAdmin/bienvenida';
import { Herramienta } from './components/herramienta/herramienta';
import { Inventario } from './components/inventario/inventario';
import { Detalle } from './components/detalle/detalle'; // Para ver detalles de una herramienta específica

// Aquí empieza la definición de rutas. Es un arreglo de objetos tipo Route.
export const routes: Routes = [
  // Ruta base vacía que redirige automáticamente al login. Esto es lo que carga por defecto.
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Ruta para el login. No necesita guardia porque debe ser accesible siempre.
  { path: 'login', component: Login },

  // Ruta para el 'home'. Tiene guardia, así que si no estás logueada, te bota.
  { path: 'home', component: Home, canActivate: [AuthGuard] },

  // Ruta principal para el superadmin. También tiene guardia y contiene rutas hijas.
  {
    path: 'superadmin',
    component: SuperAdmin,
    canActivate: [AuthGuard], // Este guardia protege TODA esta ruta y sus hijas.

    // Hijas del superadmin (se muestran dentro del componente <router-outlet> del SuperAdmin)
    children: [
      { path: '', component: Bienvenida },       // Ruta por defecto si solo vas a /superadmin
      { path: 'roles', component: RolLista },
         { path: 'roles/crear', component: RolCrear },           // Ruta para gestión de roles
      { path: 'usuarios', component: UsuarioLista },  // Ruta para gestión de usuarios
       { path: 'usuarios/crear', component: UsuarioCrear },
      { path: 'herramientas', component: Herramienta }, // Ruta para listado de herramientas
      { path: 'inventario', component: Inventario },     // Ruta para el módulo de inventario

      // Ruta dinámica para mostrar los detalles de una herramienta según su nombre.
      { path: 'herramientas/:nombre', component: Detalle }
    ]
  },
];
