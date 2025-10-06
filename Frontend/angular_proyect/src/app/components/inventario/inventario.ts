/* Este componente de Inventario se encarga de lista las 
herramientas del backend, tiene paginacion mensajes globales, 
busqueda con filtro, ver detalle de una herramientab en especifico
y arma lla url de cda aimagen almacenada del back  */

import { Component, OnInit } from '@angular/core';
import { HerramientaService } from '../../services/herramienta';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { MessageService } from '../../services/mensaje';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.html',
  imports: [CommonModule, RouterLink, NgxPaginationModule, FormsModule]
})
export class Inventario implements OnInit {
  herramientas: any[] = []; // Herramientas cargadas desde el back
  // Paginacion
  currentPage: number = 1; // La pagina actual
  itemsPerPage: number = 10; // Cuantos elementos mostrar por pagina

  herramientaSeleccionada: any = null; // Guarda herramienta seleccionada que se quiere ver en detalle
  mensaje: string | null = null; // Para mostrar texto de mensaje
  mensajeTipo: string = 'alert-success'; // Tipo de mensaje error o exito

  private filtroSubject = new Subject<string>(); // Filtro de la busqueda
  filtro: string = '';

  // Inyectar servicios
  constructor(
    private herramientaService: HerramientaService,
    private sanitizer: DomSanitizer,
    private messageService: MessageService
  ) { }

  /* Cuando se carga el componente, muestra una lista de herramientas,
  hay paginacion y busqueda por filtro, ver detalle de una herramienta en especifico*/

  ngOnInit() {

    this.messageService.currentMessage.subscribe(msg => { // Es un observable, escucha los mensajes
      if (msg) { // Si existe 
        this.mensaje = msg.texto; // Guarda el texto del mensaje
        this.mensajeTipo = msg.tipo === 'success' ? 'alert-success' : 'alert-danger';// Dependiendo del menmsaje esta el tipo
        setTimeout(() => {
          this.mensaje = null;
          this.messageService.clearMessage();
        }, 3000); // El mensaje desaparece automaticamnete despus de 3 segundos
      }
    });

    // llama al servicio para listar las herramientas desde el back
    this.herramientaService.listar().subscribe(data => {
      this.herramientas = data; // se guarda las herramientas en un areglo
    });

    // Un observable que emite lo que escribe el usuario en el buscador
    this.filtroSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged()     // Solo emite si el texto cambia
      )
      .subscribe(filtro => { // Se decide que hacer on el texto
        if (!filtro.trim()) { // Si est vacio vuelve a traer la lista
          this.herramientaService.listar().subscribe(data => this.herramientas = data);
        } else {
          this.herramientaService.buscarHerramientas(filtro).subscribe({ // Si si hay texto llama al back
            next: (data) => this.herramientas = data, // Si llega la repuesta actualiza this.herramientas
            error: (err) => console.error('Error en búsqueda:', err)// si hay error en la busqueda muestra en consola
          });
        }
      });
  }
  /* Se ejecuta cada vez que el usuario escribe algo en el buscador */

  onBuscarChange(valor: string) {
    this.filtroSubject.next(valor); //Emite ese valor al observable filtroSubject
  }

  /* Recibe como parametro una herramienta, se asigna a la variable
  herramientaSeleccionada  */
  visualizar(herramienta: any) {
    this.herramientaSeleccionada = herramienta;
  }

  /* Limpia la variable de herrameintaSeleccionada */
  cerrarModal() {
    this.herramientaSeleccionada = null;
  }

   /* Recibe el nombre del archivo y le devuelve una la url de ese archivo */
  getImagenUrl(nombreArchivo: string) {
    return `http://localhost:8080/api/herramientas/uploads/${nombreArchivo}`;
  }
}
