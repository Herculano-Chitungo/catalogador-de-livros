import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatCardModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatIconModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  public errorMessage: string = '';

  public form: FormGroup = this.fb.group({
    usuario: ['', Validators.required],
    senha: ['', Validators.required]
  });

  public logar(): void {
    this.errorMessage = '';

    if (this.form.invalid) {
      this.errorMessage = 'Por favor, preencha o usuário e a senha para continuar.';
      this.form.markAllAsTouched();
      return;
    }

    const { usuario, senha } = this.form.value;

    this.authService.login(usuario, senha).subscribe({
      next: (res) => {
        localStorage.setItem('usuarioLogado', usuario);
        localStorage.setItem('usuario', usuario);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.errorMessage = 'Usuário ou senha inválidos.';
      }
    });
  }
}