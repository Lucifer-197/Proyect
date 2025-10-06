/* Formulario para crear una nueva herramienta, recibs datos necesariso
permite subir una imagen, genera un codigo dsde back, valida el 
formulario y validacion de la imagen */

import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HerramientaService } from '../../services/herramienta';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { MessageService } from '../../services/mensaje';

@Component({
  selector: 'app-crear-herramienta',
  templateUrl: './herramienta.html',
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class Herramienta {

  @ViewChild('fileInput') fileInput!: ElementRef;
 
  // Campos para el formulario de crear herremienta
  nombre = '';
  categoria = '';
  modelo = '';
  serie = '';
  marca = '';
  color = '';
  ubicacion = '';
  codigo = '';
  file!: File;

  //Inyeccion de servicios
  imagenInvalida = false;
  constructor(
    private herramientaService: HerramientaService, 
    private router: Router,
    private messageService: MessageService
  ) {}

  generarCodigo() {
    if (this.nombre && this.categoria) {
      this.herramientaService.generarCodigo(this.nombre, this.categoria).subscribe({
        next: (codigoGenerado) => { this.codigo = codigoGenerado; },
        error: (err) => {
          console.error('Error generando código:', err);
          this.messageService.setMessage(err.error?.error || 'No se pudo generar el código', 'error');
        }
      });
    }
  }

  onFileSelected(event: any) {
    this.file = event.target.files[0];
    this.imagenInvalida = !this.file;
    
  }


  crearHerramienta(form: NgForm) {
    if (form.invalid || !this.file) {
      Object.values(form.controls).forEach(control => control.markAsTouched());
      this.imagenInvalida = !this.file; 
      if (!this.file) {
        this.messageService.setMessage('La imagen es obligatoria', 'error');
      }
      return;
    }
    const formData = new FormData();
    formData.append('nombre', this.nombre);
    formData.append('categoria', this.categoria);
    formData.append('codigo', this.codigo);
    formData.append('modelo', this.modelo);
    formData.append('serie', this.serie);
    formData.append('marca', this.marca);
    formData.append('color', this.color);
    formData.append('ubicacion', this.ubicacion);
    formData.append('imagen', this.file);

    this.herramientaService.crear(formData).subscribe({
      next: (response: any) => {
        this.messageService.setMessage(response.mensaje || 'Herramienta creada correctamente', 'success');
        this.router.navigate(['/superadmin/inventario']);
      },
      error: (err) => {
        this.messageService.setMessage(err.error?.error || 'Error al crear herramienta', 'error');
        this.router.navigate(['/superadmin/inventario']);
      }
    });
  }

  private limpiarFormulario(form: NgForm) {
    this.nombre = '';
    this.categoria = '';
    this.codigo = '';
    this.modelo = '';
    this.serie = '';
    this.marca = '';
    this.color = '';
    this.ubicacion = '';
    this.file = {} as File;

    if (this.fileInput) this.fileInput.nativeElement.value = '';
    form.resetForm();
  }
}
