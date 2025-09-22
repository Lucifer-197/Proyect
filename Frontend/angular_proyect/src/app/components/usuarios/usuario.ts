// Importaciones necesarias desde Angular y servicios personalizados
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RolService } from '../../services/rol';
import { UsuarioService } from '../../services/usuario';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuario.html',
})
export class Usuario implements OnInit {
  // Modelo para capturar los datos del formulario de creación de usuarios
  nuevoUsuario = { nombreUsuario: '', clave: '', idRol: null };

  usuarios: any[] = [];
  rolesFiltrados: any[] = [];
  editingUsuario: any = null;

  constructor(
    private usuarioService: UsuarioService,
    private rolService: RolService
  ) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.usuarioService.getUsuarios().subscribe(data => {
      this.usuarios = data.filter(u => u.rolesModel?.nombreRol !== 'SUPER_ADMIN');
    });

    this.rolService.getRoles().subscribe(data => {
      this.rolesFiltrados = data.filter(r => r.nombreRol !== 'SUPER_ADMIN');
    });
  }

  crearUsuario(form: any) {
    if (!this.nuevoUsuario.nombreUsuario.trim()) {
      alert('El nombre de usuario no puede estar vacío');
      return;
    }
    if (!this.nuevoUsuario.clave.trim()) {
      alert('La clave no puede estar vacía');
      return;
    }
    if (!this.nuevoUsuario.idRol) {
      alert('Debes seleccionar un rol');
      return;
    }

    this.usuarioService.addUsuario(this.nuevoUsuario).subscribe({
      next: () => {
        alert('Usuario creado');
        form.resetForm({ nombreUsuario: '', clave: '', idRol: null }); //resetea vacío
        this.nuevoUsuario = { nombreUsuario: '', clave: '', idRol: null }; // seguridad extra
        this.cargarDatos();
      },
      error: () => alert('Error creando usuario')
    });
  }

  editUsuario(usuario: any) {
    this.editingUsuario = { ...usuario, idRol: usuario.rolesModel?.idRol };
  }

  cancelEditUsuario() {
    this.editingUsuario = null;
  }

  updateUsuario() {
    if (!this.editingUsuario.nombreUsuario.trim()) {
      alert('El nombre de usuario no puede estar vacío');
      return;
    }
    if (!this.editingUsuario.idRol) {
      alert('Debes seleccionar un rol');
      return;
    }

    this.usuarioService.updateUsuario(this.editingUsuario).subscribe({
      next: () => {
        alert('Usuario actualizado');
        this.editingUsuario = null;
        this.cargarDatos();
      },
      error: () => alert('Error actualizando usuario')
    });
  }

  deleteUsuario(id: number) {
    if (confirm('¿Seguro que quieres eliminar este usuario?')) {
      this.usuarioService.deleteUsuario(id).subscribe({
        next: () => {
          alert('Usuario eliminado');
          this.cargarDatos();
        },
        error: () => alert('Error eliminando usuario')
      });
    }
  }
}
