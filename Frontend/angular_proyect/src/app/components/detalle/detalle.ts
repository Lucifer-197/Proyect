// Importación de clases necesarias para el componente
import { CommonModule } from '@angular/common'; // Módulo común de Angular (necesario para ngIf, ngFor, etc.)
import { Component, OnInit } from '@angular/core'; // Decorador @Component y ciclo de vida OnInit
import { ActivatedRoute } from '@angular/router'; // Para acceder a los parámetros de la ruta
import { HerramientaService } from '../../services/herramienta'; // Servicio que trae las herramientas desde el backend

// Decorador que define el componente Angular
@Component({
  selector: 'app-detalle-herramienta',        // Selector del componente
  templateUrl: './detalle.html',              // Ruta a la plantilla HTML
  imports:[CommonModule]                      // Importa CommonModule para usar directivas comunes
})
export class Detalle implements OnInit {      // Clase del componente que implementa OnInit

  // Variable para guardar la herramienta que se va a mostrar
  herramienta: any = null;                    

  // Constructor que inyecta servicios necesarios
  constructor(
    private route: ActivatedRoute,            // Permite acceder a parámetros de la URL
    private herramientaService: HerramientaService // Servicio que maneja las herramientas
  ) {}

  // Metodo del ciclo de vida que se ejecuta al iniciar el componente
  ngOnInit(): void {
    // Obtener el parámetro 'nombre' desde la URL
    const maquina = this.route.snapshot.paramMap.get('maquina');

    // Si se encuentra un nombre en la URL
    if (maquina) {
      // Llamar al servicio para obtener la lista de herramientas
      this.herramientaService.listar().subscribe(herramientas => {
        // Buscar la herramienta cuyo nombre coincida con el parámetro (sin distinguir mayúsculas/minúsculas)
        this.herramienta = herramientas.find(h => h.maquina.toLowerCase() === maquina.toLowerCase());
      });
    }
  }

  // Método que construye la URL de la imagen desde el nombre del archivo
getImagenUrl(nombreArchivo: string): string {
  return `http://localhost:8080/api/herramientas/uploads/${nombreArchivo}`;
}

}
