/* Componente muestra un formaulario para cerar un nuevo usuario, con el nombre
y los roles disponible para asignar y campo de clave, valida formulario
envia al backend muestra mensaje de exito y redirije a la lista de usuarios */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { UsuarioService } from '../../services/usuario';
import { RolService } from '../../services/rol';
import { Router } from '@angular/router';
import { MessageService } from '../../services/mensaje';

@Component({
  selector: 'app-usuario-crear',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarioCrear.html',
})
export class UsuarioCrear implements OnInit {
  nuevoUsuario = { nombreUsuario: '', clave: '', idRol: null };
  rolesFiltrados: any[] = []; // Array de los roles filtrados excluyendo el SUPER_ADMIN
  mensaje = '';
  mensajeTipo = '';

  constructor(
    private usuarioService: UsuarioService,
    private rolService: RolService,
    private router: Router,
    private messageService: MessageService
  ) { }

  /* Se ejecutra cuando se carga el componente */

  ngOnInit(): void {
    this.nuevoUsuario = { nombreUsuario: '', clave: '', idRol: null }; // Se inicilaiza el objeto enlazado con el formulario
    this.cargarRoles(); // Llama  la funcion de cargar roles 
  }

  /* Pide la lista de roles filtrado el role de SUPER_ADMIN y gurda en 
  en la variable roles filtrados*/

  cargarRoles() {
    this.rolService.getRoles().subscribe(data => { // Llama al servcico para hacer la peticion
      // Devuelve un observable con el arreglo de roles 
      this.rolesFiltrados = data.filter(r => r.nombreRol !== 'SUPER_ADMIN'); // Cra una lista exluyendo el rol SUPER_ADMIN
    });
  }

  /* Valida el formualario si esta bien envia los datos al back
  si el servidor rresponde redirecciona a la lista de usuarios y 
  muestra mensaje exitoso */

  crearUsuario(form: NgForm) {
    if (form.invalid) { // Hace las validaciones
      Object.values(form.controls).forEach(control => control.markAsTouched());
      return;
    }

    this.usuarioService.addUsuario(this.nuevoUsuario).subscribe({ // Hace la peticion
      next: () => {
        // Mensaje de éxito enviado al servicio y redirige a lista
        this.messageService.setMessage('Usuario creado correctamente', 'success');
        this.router.navigate(['/superadmin/usuarios']);
      },
      error: () => {
        this.mensaje = 'Error creando usuario';
        this.mensajeTipo = 'alert-danger';
        this.ocultarMensaje();
      }
    });
  }

  /* Borra el texto del mesaje despues de 3 segundos despues de llamarse */

  private ocultarMensaje() {
    setTimeout(() => {
      this.mensaje = '';
    }, 3000);
  }
}
