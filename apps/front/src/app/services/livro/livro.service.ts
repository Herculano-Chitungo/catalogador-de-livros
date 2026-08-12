import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Livro } from '@nx-monorepo/comum';

@Injectable({
  providedIn: 'root'
})
export class LivroService {
  private http = inject(HttpClient);
  private readonly API = 'http://localhost:3333/api/livros';

  getAll(): Observable<Livro[]> {
    return this.http.get<Livro[]>(this.API);
  }

  save(livro: any): Observable<any> {
    const livroId = livro.id || livro._id;
    
    if (livroId) {
      return this.http.put<any>(`${this.API}/${livroId}`, livro);
    }
    return this.http.post<any>(this.API, livro);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}