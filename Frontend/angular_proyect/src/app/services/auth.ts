import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  public isLoggedIn$ = new BehaviorSubject<boolean>(false);
  private currentRol: string | null = null;

  private apiUrl = 'http://localhost:8080/api'; // Gateway

  constructor(private http: HttpClient, private router: Router) {}

  // -----------------------------
  // LOGIN usando cookies HttpOnly
  // -----------------------------
  login(nombreUsuario: string, clave: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/login`,
      { nombreUsuario, clave },
      { withCredentials: true } // 🔹 cookies HttpOnly
    );
  }


  // -----------------------------
  // Estado de login
  // -----------------------------
  setLoggedIn(value: boolean) {
    this.isLoggedIn$.next(value);
  }

  isLoggedIn(): boolean {
    return this.isLoggedIn$.value; // Devuelve estado actual
  }

  // -----------------------------
  // Guardar rol en memoria
  // -----------------------------
  setCurrentRol(rol: string) {
    this.currentRol = rol;
    this.setLoggedIn(true);
  }

  getCurrentRol(): string | null {
    return this.currentRol;
  }
  // -----------------------------
  // LOGOUT centralizado
  // -----------------------------
  logout(): void {
    this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true })
      .subscribe({
        next: () => {
          console.log('Sesión cerrada en backend');
          this.setLoggedIn(false);
          this.currentRol = null;
          this.router.navigate(['/login'], { replaceUrl: true });
        },
        error: (err) => {
          console.error('Error cerrando sesión en backend', err);
          // Aún si falla, limpiamos el estado del cliente
          this.setLoggedIn(false);
          this.currentRol = null;
          this.router.navigate(['/login'], { replaceUrl: true });
        }
      });
  }
}
