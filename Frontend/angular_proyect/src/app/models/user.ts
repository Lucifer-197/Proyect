// Este archivo define interfaces TypeScript para estructurar datos relacionados con usuarios y roles.

// Interfaz para representar un usuario
export interface User {
  // Nombre del usuario, normalmente usado para iniciar sesión
  nombreUsuario: string;

  // Clave del usuario (contraseña)
  clave: string;

  // Rol que tiene el usuario dentro del sistema (ej: 'admin', 'usuario', etc.)
  rol: string;
}

// Interfaz para representar un rol dentro del sistema
export interface Rol {
// ID único del rol (puede ser usado como clave primaria)
id: number;

// Nombre del rol (por ejemplo, 'Administrador', 'SuperAdmin', 'Invitado', etc.)
nombre: string;

// Descripción detallada del rol, útil para entender sus permisos o funciones
descripcion: string;
}
