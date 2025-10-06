/* Este componente se encarga de listar roles, buscar roles por medio
de filtros y eliminar roles, muestra mesasje globales, paginacion */

import { Component, OnInit, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RolService } from '../../services/rol';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterModule } from '@angular/router';
import { MessageService } from '../../services/mensaje';

@Component({
  selector: 'app-rol-lista',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule, RouterModule],
  templateUrl: './rolLista.html',
})
export class RolLista implements OnInit {
  @Input() reloadSignal?: any; // Permite recargar la lista si otro componente envia una señal

  roles: any[] = []; // Array con todos los roles del back
  rolesFiltrados: any[] = []; // Array contieen los roles con el filtro
  editingRol: any = null; // variable depl rol que se este editando, si esta null no hay rol editando
  page = 1; // Paginacion se empieza mostrando la priemra pagina

  mensaje = ''; //El texto a mostar
  mensajeTipo = ''; // El tip de mensaje

  rolToDelete: any = null; // Variable para rol que se elimina, sis esta null no hay seleccion de rol
  searchText: string = ''; // Variable dodne el usuario escrie eltexto en el buscador, para filtrar las busquedas

  //Inyeccion de servicios
  private rolService = inject(RolService);
  private messageService = inject(MessageService);

  /*Al cargar el componente carga los roles, se suscribe a
  mensajes  globales, muestra el mensajes dependiendo el tipo 
  despues de 3 segundos se borra de la pantalla  */

  ngOnInit() {
    this.cargarRoles(); // Obtine los roles del backend al cargar el componente

    this.messageService.currentMessage.subscribe(msg => { // Para mostarr mesajes globales
      if (msg) { // Si hay un menaje lo procesa dependiendo el tipo
        this.mensaje = msg.texto;
        this.mensajeTipo = msg.tipo === 'success' ? 'alert-success' : 'alert-danger';

        setTimeout(() => { // limpia el mesaje automaticamente despues de 3 seguncdos
          this.mensaje = '';
          this.messageService.clearMessage();
        }, 3000);
      }
    });
  }

  /* Se activa cuando cambia el @Input reloadsignal cambia
  debemos refresacr los datos se llamar a cargarroles para actualizar*/

  ngOnChanges() {
    if (this.reloadSignal) {
      this.cargarRoles();
    }
  }

  /* Obtiene la lista de los rles desde el back y los
  guarda, los filtra y ya se muestran*/

  cargarRoles() {
    this.rolService.getRoles().subscribe(data => { // Llama al servicio para traer roles
      //Se suscribe a un observable que devuelve el servicio
      this.roles = data; // Guarda los roles
      this.rolesFiltrados = this.roles.filter(r => r.nombreRol !== 'SUPER_ADMIN');// Una lista filtrada
    });
  }

  /* Toma lo que escribe el usuario en l buscadoir, lo convierte
  a minusculas, lo filtra y se muestra los que coinciden con la 
  ¨busqueda */

  onSearchChange() {
    const filtro = this.searchText.toLowerCase(); // Convierte la busqueda en letra minuscula
    this.rolesFiltrados = this.roles.filter(r => // recorre y devuelve lo que tengan coicidencia
      r.nombreRol.toLowerCase().includes(filtro)
    );
  }

  /* Se selecciona el id rol para editar y crear una copia
  para editarlo */

  editRol(rol: any) {
    this.editingRol = { ...rol };
  }

  cancelEditRol() {
    this.editingRol = null; // Cancela la edicion y se limpia
  }

  /* Valida que los campos no esten vacios llama al backend para
  actualizar el rol si tiene exito mustra mensaje oculta el form 
  de edicion refersca la lista de roles si hay error muestra el mesnaje */

  updateRol() { // Validar campos, elimando espacios (trim)
    if (!this.editingRol.nombreRol.trim() || !this.editingRol.descripcion.trim()) {
      this.mensaje = 'Todos los campos son obligatorios';
      this.mensajeTipo = 'alert-danger';
      setTimeout(() => this.mensaje = '', 3000);
      return;
    }

    this.rolService.updateRol(this.editingRol).subscribe({ // Llama al servicio que hace la peticion al back
      //Escucha el observable la respuesta del servidor
      next: () => { // Muestra mensaje de exito
        this.mensaje = 'Rol actualizado';
        this.mensajeTipo = 'alert-success';
        this.editingRol = null;
        this.cargarRoles();
        setTimeout(() => this.mensaje = '', 3000); // Se quita despues de 3 segundos
      },
      error: () => {
        this.mensaje = 'Error actualizando rol'; // Mensaje en caso de erro se quita despues de 3 segundos
        this.mensajeTipo = 'alert-danger';
        setTimeout(() => this.mensaje = '', 3000);
      },
    });
  }

  // Cuando se escoje un rol para eliminar
  confirmDelete(rol: any) {
    this.rolToDelete = rol;// Guarad ese rol en la variable  para confirmacion
  }

  // Cuando decide no eliminar el rol
  cancelDelete() {
    this.rolToDelete = null; // Se limpia la variable del rol que se guardo paar eliminar
  }

  /* Verifica si hay un rol seleccionado llama al bacjkend para
  eliminarlo si es exitos lo elimina y muestar el mensaje de exito
  si hay error muestra el mesaje de error */

  deleteRol() {
    if (!this.rolToDelete) return; // Verifica que tenga un rol seleccionado, es la variable dodne se guarda el rol seleccionado

    this.rolService.deleteRol(this.rolToDelete.idRol).subscribe({ // Llama al servicio y hace la peticion al back
      //escuha la respsueta 
      next: () => { // si es correcta elimina el rol localmente 
        this.roles = this.roles.filter(r => r.idRol !== this.rolToDelete.idRol);
        this.rolesFiltrados = this.rolesFiltrados.filter(r => r.idRol !== this.rolToDelete.idRol);

        this.mensaje = 'Rol eliminado correctamente';// Muestra mensaje exitoso
        this.mensajeTipo = 'alert-success';
        this.rolToDelete = null;

        setTimeout(() => this.mensaje = '', 3000); // despues de 3 segundos desaparece el mensaje
      },
      error: (err) => {
        if (err.status === 409) { // Manejo de errores
          this.mensaje = 'No puedes eliminar este rol porque está asignado a uno o más usuarios.';
        } else if (err.status === 404) {
          this.mensaje = 'El rol ya no existe en el sistema.';
        } else {
          this.mensaje = 'Error inesperado al eliminar el rol.';
        }
        this.mensajeTipo = 'alert-danger';
        setTimeout(() => this.mensaje = '', 3000);
      },
    });
  }

}
