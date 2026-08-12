import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LivroService } from '../../services/livro/livro.service';

@Component({
  selector: 'app-form-livro',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './form-livro.component.html'
})
export class FormLivroComponent implements OnInit {
  private livroService = inject(LivroService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  livro: any = { titulo: '', autor: '', categoria: '', preco: null };
  isEdicao = false;
  livroId: string | null = null;
  mensagemErro = '';

  ngOnInit(): void {
    this.livroId = this.route.snapshot.paramMap.get('id');
    if (this.livroId) {
      this.isEdicao = true;
      this.livroService.getAll().subscribe((livros: any[]) => {
        const encontrado = livros.find(l => (l._id || l.id) === this.livroId);
        if (encontrado) {
          this.livro = { ...encontrado };
        }
      });
    }
  }

  salvar(): void {
    if (!this.livro.titulo || !this.livro.autor || !this.livro.categoria || this.livro.preco === null || this.livro.preco === undefined) {
      this.mensagemErro = 'Por favor, preencha todos os campos obrigatórios, incluindo o preço.';
      return;
    }

    this.mensagemErro = '';
    this.livroService.save(this.livro).subscribe(() => {
      this.router.navigate(['/home']);
    });
  }
}