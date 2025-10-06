/* Este componente se encarga de cargar los usuarios desde el backend
buscar por medio de filtros, editar y eliminar a los usuarios, paginacion */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { UsuarioService } from '../../services/usuario';
import { RolService } from '../../services/rol';
import { RouterModule } from '@angular/router';
import { MessageService } from '../../services/mensaje';

@Component({
  selector: 'app-usuario-lista',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule, RouterModule],
  templateUrl: './usuarioLista.html',
})
export class UsuarioLista implements OnInit {
  usuarios: any[] = []; // Array con los usuarios recibidos del backend
  rolesFiltrados: any[] = []; // Todos los roles del backend menos el de SUPER_ADMIN
  editingUsuario: any = null;
  showEditPassword = false;
  searchText: string = '';
  currentPage = 1;
  itemsPerPage = 10;

  mensaje: string = '';
  mensajeTipo: 'success' | 'error' = 'success';
  usuarioToDelete: any = null;

  constructor(
    private usuarioService: UsuarioService,
    private rolService: RolService,
    private messageService: MessageService
  ) { }

  /* Se ejecuta cuando el componete se ha inicializado se
  cargan los usuarios. Cada vez que llega un mensaje lo muestro en
  la pantalla y lo elimina tras 3 segundos */

  ngOnInit() {
    this.cargarDatos(); // Obtener los usuarios


    this.messageService.currentMessage.subscribe(msg => { // Un observable que emite mensajes, escucha si hay un nuevo mensaje
      if (msg) {
        this.mostrarMensaje(msg.texto, msg.tipo);// Si hay un mensaje lo procesa dependiendo si es exitoso o no
        setTimeout(() => this.messageService.clearMessage(), 3000); // Despues de tres segundo el mesaje desapárece
      }
    });
  }

  /* Trae a los usuarios excluyendo el usuario del supoeradmin*/

  cargarDatos() {
    this.usuarioService.getUsuarios().subscribe((data) => { //Llama al backend devolviendo la lista de usuarios
      this.usuarios = data.filter(u => u.rolesModel?.nombreRol !== 'SUPER_ADMIN'); //Filtra el rol, que excluya eL rol SUPER_ADMIN
    });

    this.rolService.getRoles().subscribe((data) => {
      this.rolesFiltrados = data.filter(r => r.nombreRol !== 'SUPER_ADMIN');
    });
  }

  /*  Prepara una copia del usuario para actualizarlo y la propiedad
  idRol pata enlazarlo con un <select>, esta ya queda actualizada cuando 
  el servicio llama a updateUsuario y el backend lo guarda*/

  editUsuario(usuario: any) {
    this.editingUsuario = { ...usuario, idRol: usuario.rolesModel?.idRol }; // Se crea la copia
    this.showEditPassword = false;
  }


  cancelEditUsuario() {
    this.editingUsuario = null; // Cancelar la edicicion
  }

  /* El usuario edita los campos, deben de estar llenos para que no salga error
   si pasa la validacion se hace la peticion al back y el back loa ctualiza
   si no hay errores, si hay errore muestyra mensaje de error*/

  updateUsuario() {
    if (!this.editingUsuario.nombreUsuario.trim() || !this.editingUsuario.idRol) { // Valido que los campos no esten vacios
      this.mostrarMensaje('Todos los campos son obligatorios', 'error');
      return;
    }
    // LLama al servcicio que hace la petiucion al backend
    this.usuarioService.updateUsuario(this.editingUsuario).subscribe({
      next: () => { // Si responde con exito 
        this.mostrarMensaje('Usuario actualizado', 'success');// Muestra con exito el mensaje
        this.editingUsuario = null;// Sale delmodo edicion
        this.cargarDatos(); // Vuelve a tarer la lista actualizada
      },
      error: () => this.mostrarMensaje('Error actualizando usuario', 'error') // Muestra un mensaje de error si falla
    });
  }

  deleteUsuario(usuario: any) {
    this.usuarioToDelete = usuario; //Guarda el usuario y muestra un mensaje de confirmacion
  }

  /* Verifica que exista usuario para eliminar, llama 
  al back para borrar ese ususario, si todo esta bien mensaje
  exitoso si no mensaje de error*/

  confirmDeleteUsuario() {
    if (!this.usuarioToDelete) return; // valida que exista usuario

    this.usuarioService.deleteUsuario(this.usuarioToDelete.idUsuarios).subscribe({
      next: () => {
        // Si el backend confirma que se borro 
        this.mostrarMensaje('Usuario eliminado', 'success');
        this.usuarioToDelete = null; // Borra el usuario que esta en la variable de confirmacion
        this.cargarDatos();// Trae la lista sin el usuario
      },
      error: () => this.mostrarMensaje('Error eliminando usuario', 'error')// Muesttra el mesaje de error
    });
  }

  cancelDeleteUsuario() {
    this.usuarioToDelete = null; // Cancela la eliminacion
  }

  /* Cuando se escriba en el buscador hace una busqueda
  en el servidor, si se borra vuelve a quedar en la priemra pagina */

  onSearchChange() {
    if (!this.searchText.trim()) { // Valida  que el campo esta vacio o tiene espacios
      this.cargarDatos(); // Si no hay texto vuelve a cargar los datos 
      return;
    }
    // Si hay texto llama al servicio  que hace la peticion al back para buscar usuario que coincidan
    this.usuarioService.buscarUsuarios(this.searchText).subscribe({
      next: (data) => { // Arreglo de usuarios segun lo filtrado
        this.usuarios = data; 
        this.currentPage = 1;
      },
      error: () => console.error('Error buscando usuarios')
    });
  }

    /* Muestra un mensaje tipo error o exito y lo boorra
    automatican despues de 3 segundos*/ 
    
  mostrarMensaje(texto: string, tipo: 'success' | 'error' = 'success') {
    this.mensaje = texto;
    this.mensajeTipo = tipo;
    setTimeout(() => this.mensaje = '', 3000);
  }
}
