import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { LivroService } from '../../services/livro/livro.service';
import { Livro } from '@nx-monorepo/comum';

@Component({
  selector: 'app-livro-lista',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatTableModule, MatIconModule],
  templateUrl: './livro-lista.component.html',
  styleUrls: ['./livro-lista.component.css']
})
export class ListaLivrosComponent implements OnInit {
  private livroService = inject(LivroService);
  private router = inject(Router);
  
  public livros: Livro[] = [];
  public usuarioLogado: boolean = false;

  ngOnInit(): void {
    const usuario = localStorage.getItem('usuarioLogado') || localStorage.getItem('usuario');
    this.usuarioLogado = !!usuario; 

    this.carregarLivros();
  }

  get displayedColumns(): string[] {
    return this.usuarioLogado 
      ? ['titulo', 'autor', 'categoria', 'preco', 'acoes'] 
      : ['titulo', 'autor', 'categoria', 'preco'];
  }

  public carregarLivros(): void {
    this.livroService.getAll().subscribe({
      next: (data: Livro[]) => {
        this.livros = (data || []).map((l: any) => ({ ...l, id: l._id || l.id }));
      },
      error: (err: unknown) => {
        console.error('Erro ao carregar livros da API:', err);
      }
    });
  }

  public apagar(id: string): void {
    if (!id) return;
    
    if (confirm('Tem certeza que deseja excluir este livro?')) {
      this.livroService.remove(id).subscribe({
        next: () => this.carregarLivros(),
        error: (err: unknown) => console.error('Erro ao apagar livro:', err)
      });
    }
  }

  public sair(): void {
    localStorage.removeItem('usuarioLogado');
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }
}