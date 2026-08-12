import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guards';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { 
    path: 'login', 
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) 
  },
  { 
    path: 'home', 
    loadComponent: () => import('./modules/livro-lista/livro-lista.component').then(m => m.ListaLivrosComponent),
    canActivate: [authGuard] 
  },
  { 
    path: 'livros/novo', 
    loadComponent: () => import('./components/form-livro/form-livro.component').then(m => m.FormLivroComponent),
    canActivate: [authGuard] 
  },
  { 
    path: 'livros/editar/:id', 
    loadComponent: () => import('./components/form-livro/form-livro.component').then(m => m.FormLivroComponent),
    canActivate: [authGuard] 
  },
  { path: '**', redirectTo: 'login' }
];