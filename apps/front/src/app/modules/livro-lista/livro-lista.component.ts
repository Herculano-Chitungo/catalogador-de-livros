import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LivroService } from '../../services/livro/livro.service';
import { Livro } from '@nx-monorepo/comum';

@Component({
  selector: 'app-livro-lista',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    FormsModule,
    MatButtonModule, 
    MatTableModule, 
    MatIconModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './livro-lista.component.html',
  styleUrls: ['./livro-lista.component.css']
})
export class ListaLivrosComponent implements OnInit {
  private livroService = inject(LivroService);
  private router = inject(Router);
  
  public livros: Livro[] = [];
  public usuarioLogado: boolean = false;
  public termoBusca: string = '';

  public paginaAtual: number = 1;
  public itensPorPagina: number = 10;

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

  get livrosFiltrados(): Livro[] {
    if (!this.termoBusca.trim()) {
      return this.livros;
    }
    const termo = this.termoBusca.toLowerCase();
    return this.livros.filter(livro => 
      (livro.titulo && livro.titulo.toLowerCase().includes(termo)) || 
      (livro.autor && livro.autor.toLowerCase().includes(termo))
    );
  }

  get livrosPaginados(): Livro[] {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    return this.livrosFiltrados.slice(inicio, inicio + this.itensPorPagina);
  }

  get totalPaginas(): number {
    return Math.ceil(this.livrosFiltrados.length / this.itensPorPagina) || 1;
  }

  public mudarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaAtual = pagina;
    }
  }

  public onBuscaChange(): void {
    this.paginaAtual = 1; 
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