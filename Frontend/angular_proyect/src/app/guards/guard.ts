// auth.guard.ts (Código corregido)
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService} from "../services/auth";
import { map, take } from 'rxjs/operators';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // ✅ ¡CORRECCIÓN AQUÍ! Usa la instancia 'authService', no la clase 'AuthService'.
  return authService.isLoggedIn$.pipe(
    take(1),
    map(isLoggedIn => {
      if (isLoggedIn) {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    })
  );
};