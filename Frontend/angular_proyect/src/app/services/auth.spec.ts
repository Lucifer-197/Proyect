import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';

interface LoginResponse {
  username: string;
  rol: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentRol: string | null = null;
  private currentUser: string | null = null;

  public isLoggedIn$ = new BehaviorSubject<boolean>(false);

  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient, private router: Router) {}

  // -----------------------------
  // LOGIN
  // -----------------------------
  login(nombreUsuario: string, clave: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      { nombreUsuario, clave },
      { withCredentials: true } // ⚡ token viene en cookie HttpOnly
    );
  }

  // -----------------------------
  // LOGOUT
  // -----------------------------
  logout() {
    this.currentRol = null;
    this.currentUser = null;
    this.isLoggedIn$.next(false);
    // Opcional: llamar a un endpoint de logout que borre cookies HttpOnly
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  // -----------------------------
  // GUARDAR USUARIO Y ROL
  // -----------------------------
  setUserData(username: string, rol: string) {
    this.currentUser = username;
    this.currentRol = rol;
    this.isLoggedIn$.next(true);
  }

  getCurrentUser(): string | null {
    return this.currentUser;
  }

  getCurrentRol(): string | null {
    return this.currentRol;
  }
}
