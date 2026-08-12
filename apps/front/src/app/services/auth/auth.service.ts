import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private API = 'http://localhost:3333/api/auth';

  login(usuario: string, senha: string): Observable<any> {
    return this.http.post<any>(`${this.API}/login`, { usuario, senha }).pipe(
      tap(res => {
        localStorage.setItem('token', res.token || 'ativo');
        localStorage.setItem('usuario', usuario);
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token') || !!localStorage.getItem('usuarioLogado');
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioLogado');
    localStorage.removeItem('usuario');
  }
}