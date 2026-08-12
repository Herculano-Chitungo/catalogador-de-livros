# Catalogador de Livros

Aplicação Web desenvolvida para o gerenciamento de um acervo de livros, utilizando uma arquitetura Nx Monorepo com Angular no frontend e Node.js no backend, integrada ao banco de dados MongoDB Atlas.

## 🚀 Como rodar o projeto

### 1. Pré-requisitos
- Node.js instalado na máquina.
- Conexão com a internet para acesso ao banco de dados em nuvem.

### 2. Clonar o repositório
```bash
git clone <url-do-seu-repositorio>
cd catalogador-de-livros

### 3. Executar a aplicação
Abra **dois terminais** para rodar o backend e o frontend simultaneamente:

- **Terminal 1 — Iniciar o Backend (API):**
  ```bash
  npx nx serve api

- **Terminal 2 — Iniciar o Frontend:**
    npx nx serve front