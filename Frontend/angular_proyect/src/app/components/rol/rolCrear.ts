/* El compnente se encarga en el fromualrio para crear un nuevo
rol, en dodne el ususrio llena el form se valida que este correcto
si esta bien se llama al back y dependiendo de la respuesta da mensaje
de exito o error y redirije a la lista */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RolService } from '../../services/rol';
import { Router } from '@angular/router';
import { MessageService } from '../../services/mensaje';

@Component({
  selector: 'app-rol-crear',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rolCrear.html',
})
export class RolCrear {
  nuevoRol = { nombre: '', descripcion: '' }; // Objeto oddne se guarda la info del nuevo rol
  mensaje = ''; // Mensaje locales, el texto del mesaje
  mensajeTipo = ''; // Que tipo de mensje va hacer

  // Inyeccion de servicios
  private rolService = inject(RolService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  /* La función valida un formulario antes de crear un rol
   si el fromulario est mal dilitgenciado apaecera los erroes para corregir*/

  crearRol(form: NgForm) { // Recibe un formulario (NgForm), se encarga de crear el rol pero se valida que este bien
    if (form.invalid) { // Se revisa que este valido el form
      // Contiene los controles del formulario lo convierte en un array para poder recorrerlo
      Object.values(form.controls).forEach(c => c.markAsTouched()); 
      return;
    }

    this.rolService.addRol({
      nombreRol: this.nuevoRol.nombre,
      descripcion: this.nuevoRol.descripcion,
    }).subscribe({ // Si pasa la validacion llama al back para crer rol, se envia el objeto
      next: () => {
        // Mensaje global usando el servicio
        this.messageService.setMessage('Rol creado correctamente', 'success');

        // Redirige a lista de roles
        this.router.navigate(['/superadmin/roles']);
      },
      error: () => {
        // Mensaje local dentro del formulario
        this.mensaje = 'Error creando rol';
        this.mensajeTipo = 'alert-danger';
        setTimeout(() => this.mensaje = '', 3000);
      },
    });
  }

}
