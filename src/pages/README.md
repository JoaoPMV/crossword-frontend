# Crossword - Frontend

Aplicação web para praticar inglês com desafios de palavras cruzadas.  
O usuário faz login, escolhe um nível e resolve os jogos com palavras relacionadas ao tema.

### Objetivo

Oferecer uma experiência interativa de estudo com foco em:

- compreensão auditiva (listening)
- ampliação de vocabulário
- prática ativa de escrita e memorização

---

## Tecnologias Utilizadas

### Frontend

- React + Vite
- JavaScript
- CSS
- React Router
- Bootstrap
- React Icons

### Backend (API)

- Node.js
- Express
- JWT (autenticação)
- MongoDB
- bcrypt

---

## Funcionalidades

- Cadastro de usuários
- Login com autenticação JWT
- Rotas protegidas por token
- Listagem de níveis
- Carregamento de jogos por nível
- Logout
- Interface responsiva

---

## Arquitetura Atual (decisões da versão)

- A autenticação é feita por token JWT salvo no `localStorage` (`authToken`)
- O frontend **não usa AuthContext** nesta versão
- Os níveis/jogos são gerenciados no backend via **seed/script**
- Não há CRUD administrativo público para criação/edição de níveis nesta versão

---

## Melhorias Futuras

- [ ] Pontuação por acertos
- [ ] Histórico de desempenho do usuário
- [ ] Feedback visual por resposta (certa/errada)
- [ ] Ranking de jogadores
- [ ] Painel admin para gerenciar níveis sem seed

---

## Como Executar o Projeto

### Pré-requisitos

- Node.js instalado
- Backend da aplicação em execução

### 1. Clonar o repositório

```bash
git clone https://github.com/JoaoPMV/crossword-frontend.git
```

### 2. Acessar a pasta do projeto

```bash
cd frontend
```

### 3. Instalar as dependências

```bash
npm install
```

### 4. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com:

```env
VITE_API_URL=http://SEU_BACKEND_HOST:PORTA
```

Exemplo:

```env
VITE_API_URL=http://localhost:5000
```

### 5. Executar o projeto

```bash
npm run dev
```

A aplicação ficará disponível em:

```bash
http://localhost:5173
```

---

## Backend da Aplicação

Este repositório contém apenas o frontend da aplicação.  
O backend (API) está disponível em:  
https://github.com/JoaoPMV/crossword-backend

---

## Autor

Desenvolvido por **JoaoPMV**  
GitHub: https://github.com/JoaoPMV
