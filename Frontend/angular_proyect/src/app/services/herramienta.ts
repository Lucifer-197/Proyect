import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HerramientaService {
  private baseUrl = 'http://localhost:8080/api/herramientas';

  constructor(private http: HttpClient) {}

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl, { withCredentials: true });
  }

  obtener(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`, { withCredentials: true });
  }

  crear(data: FormData): Observable<any> {
    return this.http.post(this.baseUrl, data, { withCredentials: true });
  }

  actualizar(id: number, herramienta: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, herramienta, { withCredentials: true });
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { withCredentials: true });
  }

  generarCodigo(nombre: string, categoria: string): Observable<string> {
    const params = new HttpParams()
      .set('nombre', nombre)
      .set('categoria', categoria);

    return this.http.get(`${this.baseUrl}/generar-codigo`, {
      params,
      responseType: 'text',
      withCredentials: true
    });
  }
}
