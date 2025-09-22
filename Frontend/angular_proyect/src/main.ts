// Importa la función principal para arrancar la aplicación con componentes standalone.
import { bootstrapApplication } from '@angular/platform-browser';

// Importa el componente raíz de la app (AppComponent, llamado aquí simplemente App).
import { App } from './app/app';

// Importa la función para registrar rutas en Angular standalone.
import { provideRouter } from '@angular/router';

// Importa las rutas definidas para la navegación de tu app.
import { routes } from './app/app.routes';

// Importa el proveedor HTTP y la función para registrar interceptores.
import { provideHttpClient, withInterceptors } from '@angular/common/http';

// Importa el interceptor personalizado que agregaste para los tokens.
import { Interceptor } from './app/interceptor';

// Aquí se arranca la aplicación con todos los proveedores necesarios.
bootstrapApplication(App, {
  providers: [
    // Proveedor para que funcione el enrutamiento con tus rutas.
    provideRouter(routes),

    // Proveedor del cliente HTTP con el interceptor del token incluido.
    provideHttpClient(withInterceptors([Interceptor]))
  ]
});
