import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { withCredentials: true });
  }

  addUsuario(usuario: any): Observable<any> {
    return this.http.post(this.apiUrl, usuario, { withCredentials: true });
  }
buscarUsuarios(filtro: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/buscar?filtro=${filtro}`);
  }
  updateUsuario(usuario: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${usuario.idUsuarios}`, usuario, { withCredentials: true });
  }

  deleteUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
}
