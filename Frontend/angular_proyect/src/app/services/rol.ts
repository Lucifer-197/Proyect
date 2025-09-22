import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

@Injectable({ providedIn: 'root' })
export class RolService {
  private apiUrl = 'http://localhost:8080/api/roles';

  constructor(private http: HttpClient) {}

  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, {
      withCredentials: true // 🔹 manda las cookies automáticamente
    });
  }



  addRol(rol: any): Observable<any> {
    return this.http.post(this.apiUrl, rol, { withCredentials: true });
  }

  updateRol(rol: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${rol.idRol}`, rol, { withCredentials: true });
  }

  deleteRol(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
}

