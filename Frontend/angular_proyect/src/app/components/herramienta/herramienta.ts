import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HerramientaService } from '../../services/herramienta';

@Component({
  selector: 'app-crear-herramienta',
  templateUrl: './herramienta.html',
  standalone: true,
  imports: [FormsModule]
})
export class Herramienta {

  @ViewChild('fileInput') fileInput!: ElementRef;

  nombre = '';
  categoria = '';
  modelo = '';
  serie = '';
  marca = '';
  color = '';
  ubicacion = '';
  codigo = '';
  file!: File;
  errorMessage = '';

  constructor(private herramientaService: HerramientaService) {}

  generarCodigo() {
    if (this.nombre && this.categoria) {
      this.herramientaService.generarCodigo(this.nombre, this.categoria).subscribe({
        next: (codigoGenerado) => { this.codigo = codigoGenerado; },
        error: (err) => {
          console.error('Error generando código:', err);
          this.errorMessage = err.error?.error || 'No se pudo generar el código';
        }
      });
    }
  }

  onFileSelected(event: any) {
    this.file = event.target.files[0];
  }

  crearHerramienta() {
    // Validación completa en Angular
    if (!this.nombre || !this.categoria || !this.codigo || !this.modelo || !this.serie || 
        !this.marca || !this.color || !this.ubicacion || !this.file) {
      this.errorMessage = 'Todos los campos son obligatorios antes de enviar.';
      alert(this.errorMessage);
      return;
    }

    const formData = new FormData();
    formData.append('maquina', this.nombre);
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
        alert(response.mensaje);

        // Limpiar campos
        this.nombre = '';
        this.categoria = '';
        this.codigo = '';
        this.modelo = '';
        this.serie = '';
        this.marca = '';
        this.color = '';
        this.ubicacion = '';
        this.file = {} as File;

        // Limpiar input de archivo
        if (this.fileInput) this.fileInput.nativeElement.value = '';
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = err.error?.error || 'Error al crear herramienta';
        alert(this.errorMessage);
      }
    });
  }
}
