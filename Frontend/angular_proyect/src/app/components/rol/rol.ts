// rol.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RolService } from '../../services/rol';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rol.html',
})
export class Rol implements OnInit {
  nuevoRol = { nombre: '', descripcion: '' };
  roles: any[] = [];
  rolesFiltrados: any[] = [];
  editingRol: any = null;

  constructor(private rolService: RolService) {}

  ngOnInit() {
    this.cargarRoles();
  }

  cargarRoles() {
    this.rolService.getRoles().subscribe(data => {
      this.roles = data;

      // Filtra para no mostrar el SUPER_ADMIN
      this.rolesFiltrados = this.roles.filter(r => r.nombreRol !== 'SUPER_ADMIN');
    });
  }

  crearRol() {
  if (!this.nuevoRol.nombre.trim() || !this.nuevoRol.descripcion.trim()) {
    alert('Todos los campos son obligatorios');
    return;
  }

  const rolParaEnviar = {
    nombreRol: this.nuevoRol.nombre,
    descripcion: this.nuevoRol.descripcion
  };

  this.rolService.addRol(rolParaEnviar).subscribe({
    next: () => {
      alert('Rol creado');
      this.nuevoRol = { nombre: '', descripcion: '' };
      this.cargarRoles();
    },
    error: () => alert('Error creando rol')
  });
}


  editRol(rol: any) {
    this.editingRol = { ...rol };
  }

  cancelEditRol() {
    this.editingRol = null;
  }

  updateRol() {
    if (!this.editingRol.nombreRol.trim() || !this.editingRol.descripcion.trim()) {
      alert('Todos los campos son obligatorios');
      return;
    }

    this.rolService.updateRol(this.editingRol).subscribe({
      next: () => {
        alert('Rol actualizado');
        this.editingRol = null;
        this.cargarRoles();
      },
      error: () => alert('Error actualizando rol')
    });
  }

  deleteRol(idRol: number) {
  if (confirm('¿Seguro que quieres eliminar este rol?')) {
    this.rolService.deleteRol(idRol).subscribe({
      next: () => {
        alert('Rol eliminado correctamente');
        this.cargarRoles();
      },
      error: (err) => {
        if (err.status === 409) {
          alert('No puedes eliminar este rol porque está asignado a uno o más usuarios.');
        } else if (err.status === 404) {
          alert('El rol ya no existe en el sistema.');
        } else {
          alert('Error inesperado al eliminar el rol.');
        }
      }
    });
  }
}

}
