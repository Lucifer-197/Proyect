// import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';

// export const Interceptor: HttpInterceptorFn = (req, next) => {
//   // Se obtiene el token directamente de las cookies del navegador.
//   const name = 'jwt_token';
//   const cookies = document.cookie.split(';');
//   let authToken = null;
  
//   for(let i = 0; i < cookies.length; i++) {
//     const cookie = cookies[i].trim();
//     if (cookie.startsWith(name + '=')) {
//       authToken = cookie.substring(name.length + 1);
//       break;
//     }
//   }

//   let clonedReq: HttpRequest<any>;

//   // Si se encontró el token, se clona la petición para añadir el encabezado de autorización
//   if (authToken) {
//     clonedReq = req.clone({
//       setHeaders: {
//         Authorization: `Bearer ${authToken}`
//       },
//       withCredentials: true // Esto ya lo tenías, y es necesario para enviar las cookies
//     });
//   } else {
//     // Si no hay token, se mantiene la petición original para rutas públicas (login, register)
//     clonedReq = req.clone({
//       withCredentials: true
//     });
//   }

//   // Continuar la cadena de interceptores con la petición modificada
//   return next(clonedReq);
// };

// src/app/interceptors/auth.interceptor.ts
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const router = inject(Router);
  const http = inject(HttpClient);

  // Siempre enviamos cookies (accessToken + refreshToken)
  const clonedReq = req.clone({
    withCredentials: true,
  });

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Caso: token expirado o inválido → 401
      if (
        error.status === 401 &&
        !req.url.includes('/api/login') &&
        !req.url.includes('/api/refresh-token')
      ) {
        console.warn('⚠️ Token expirado, intentando refresh...');

        // Intentamos pedir un nuevo accessToken con el refreshToken
        return http
          .post('http://localhost:8080/api/refresh-token', {}, { withCredentials: true })
          .pipe(
            switchMap(() => {
              console.log('✅ Refresh OK, reintentando petición original...');
              return next(clonedReq); // reintenta la petición original
            }),
            catchError((refreshError) => {
              console.error('❌ Error al refrescar token:', refreshError);

              // Opcional: llamar al logout del backend para limpiar cookies
              http.post('http://localhost:8080/api/logout', {}, { withCredentials: true }).subscribe();

              // Redirigir a login
              router.navigate(['/login']);
              return throwError(() => refreshError);
            })
          );
      }

      // Cualquier otro error se lanza tal cual
      return throwError(() => error);
    })
  );
};
