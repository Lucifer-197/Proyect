import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';

export const Interceptor: HttpInterceptorFn = (req, next) => {
  // Se obtiene el token directamente de las cookies del navegador.
  const name = 'jwt_token';
  const cookies = document.cookie.split(';');
  let authToken = null;
  
  for(let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + '=')) {
      authToken = cookie.substring(name.length + 1);
      break;
    }
  }

  let clonedReq: HttpRequest<any>;

  // Si se encontró el token, se clona la petición para añadir el encabezado de autorización
  if (authToken) {
    clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      },
      withCredentials: true // Esto ya lo tenías, y es necesario para enviar las cookies
    });
  } else {
    // Si no hay token, se mantiene la petición original para rutas públicas (login, register)
    clonedReq = req.clone({
      withCredentials: true
    });
  }

  // Continuar la cadena de interceptores con la petición modificada
  return next(clonedReq);
};
