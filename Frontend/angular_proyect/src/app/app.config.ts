// Importa configuraciones y funciones específicas del núcleo de Angular
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';

// Importa el método que permite configurar el enrutador (routing)
import { provideRouter } from '@angular/router';

// Importa el archivo de rutas definido para la app (rutas de navegación entre componentes)
import { routes } from './app.routes';

// ✨ Importaciones necesarias para el interceptor
import { provideHttpClient, withInterceptors } from '@angular/common/http';

// ✨ Importa tu interceptor
import { Interceptor } from './interceptor'; // ✅ Asegúrate que la ruta sea correcta

// Exporta una constante de configuración de la aplicación Angular
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // ✨ Configura HttpClient para usar tu interceptor
    provideHttpClient(withInterceptors([Interceptor]))
  ]
};