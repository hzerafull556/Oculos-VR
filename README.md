# OculosVR — Painel Administrativo TourVR

Monorepo do painel administrativo do projeto **TourVR / OculosVR**, composto por uma API REST em **FastAPI + MongoDB** e uma SPA em **React 19 + Vite + Tailwind CSS**, com autenticação JWT e proteção de rotas.

---

## Sumário

1. [Visão geral](#1-visão-geral)
2. [Objetivo](#2-objetivo)
3. [Stack e tecnologias](#3-stack-e-tecnologias)
4. [Estrutura do repositório](#4-estrutura-do-repositório)
5. [Requisitos para execução](#5-requisitos-para-execução)
6. [Configuração do ambiente](#6-configuração-do-ambiente)
7. [Instalação](#7-instalação)
8. [Execução em desenvolvimento](#8-execução-em-desenvolvimento)
9. [Build e testes](#9-build-e-testes)
10. [Scripts de automação](#10-scripts-de-automação)
11. [Arquitetura geral](#11-arquitetura-geral)
12. [Fluxo de autenticação](#12-fluxo-de-autenticação)
13. [Endpoints da API](#13-endpoints-da-api)
14. [Variáveis de ambiente](#14-variáveis-de-ambiente)
15. [Primeiro acesso](#15-primeiro-acesso)
16. [Estado atual do projeto](#16-estado-atual-do-projeto)
17. [Documentação interna](#17-documentação-interna)
18. [Troubleshooting](#18-troubleshooting)
19. [Licença](#19-licença)

---

## 1. Visão geral

Este repositório contém o código-fonte completo do painel administrativo do projeto **OculosVR**, inserido no ecossistema **TourVR**. A aplicação é dividida em dois módulos independentes que se comunicam via HTTP:

| Módulo | Tecnologia principal | Responsabilidade |
|---|---|---|
| `Oculos VR backend` | FastAPI + MongoDB | API REST, autenticação JWT, persistência de dados |
| `Oculos VR frontend web` | React 19 + Vite + Tailwind | Interface web, consumo da API, proteção de rotas |

A comunicação entre os módulos é baseada em tokens JWT: o backend emite o token no login e o frontend o armazena e o reenvia em cada requisição autenticada.

---

## 2. Objetivo

A finalidade do projeto é fornecer um painel web administrativo para gerenciar o ambiente VR do OculosVR. O escopo atual identificado no código cobre:

- Cadastro e autenticação de administradores via API REST;
- Proteção de rotas no frontend com base no estado de autenticação;
- Persistência de sessão via `localStorage` entre recarregamentos de página;
- Dashboard inicial com dados do usuário autenticado;
- Suite de testes automatizados para os fluxos críticos do backend.

---

## 3. Stack e tecnologias

### Backend

| Camada | Tecnologia |
|---|---|
| Framework | FastAPI 0.135 |
| Servidor ASGI | Uvicorn 0.42 |
| Banco de dados | MongoDB (pymongo 4.16, AsyncMongoClient) |
| Autenticação | JWT (python-jose 3.5) |
| Hash de senha | bcrypt (passlib 1.7) |
| Validação | Pydantic v2 + pydantic-settings |
| Testes | pytest 9.0 + httpx |
| Linguagem | Python 3.11+ |

### Frontend

| Camada | Tecnologia |
|---|---|
| Framework | React 19 |
| Build tool | Vite 6 |
| Linguagem | TypeScript 5.8 |
| Roteamento | React Router DOM v7 |
| HTTP client | Axios 1.13 |
| Estilo | Tailwind CSS v4 (via plugin Vite) |
| Ícones | Lucide React |
| Estado global | React Context API |

---

## 4. Estrutura do repositório

```text
Oculos VR/                        ← raiz do monorepo
├── README.md                     ← este arquivo
├── .gitignore
│
├── Oculos VR backend/            ← módulo backend (FastAPI)
│   ├── README.md                 ← documentação técnica do backend
│   ├── requirements.txt
│   ├── .env.example
│   ├── main.py                   ← ponto de entrada ASGI
│   ├── app/
│   │   ├── main.py               ← fábrica FastAPI + lifespan
│   │   ├── core/                 ← config, banco e segurança
│   │   ├── api/v1/               ← rotas e dependências HTTP
│   │   ├── models/               ← dataclasses do domínio
│   │   ├── schemas/              ← modelos Pydantic (I/O)
│   │   ├── repositories/         ← queries MongoDB
│   │   └── services/             ← regras de negócio
│   └── tests/
│       ├── conftest.py
│       ├── test_health.py
│       └── test_auth_flow.py
│
├── Oculos VR frontend web/       ← módulo frontend (React + Vite)
│   ├── README.md                 ← documentação técnica do frontend
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── .env.example
│   ├── index.html
│   └── src/
│       ├── main.tsx
│       ├── App.tsx               ← rotas + AuthProvider
│       ├── types/                ← contratos de dados TypeScript
│       ├── services/             ← Axios + gerenciamento de token
│       ├── contexts/             ← AuthContext (estado global)
│       ├── components/           ← ProtectedRoute, FullScreenLoader
│       └── pages/                ← Login, Dashboard
│
├── docs/
│   └── auth-flow.md              ← documentação do fluxo de autenticação
│
└── scripts/                      ← automação local (PowerShell)
    ├── install-backend.ps1
    ├── install-frontend.ps1
    ├── run-backend.ps1
    ├── run-frontend.ps1
    └── test-backend.ps1
```

---

## 5. Requisitos para execução

| Dependência | Versão mínima recomendada |
|---|---|
| Python | 3.11 |
| Node.js | 20 LTS |
| npm | 10+ (incluso no Node 20) |
| MongoDB | 6+ (local ou Atlas) |
| PowerShell | 5.1+ (para os scripts de automação) |

---

## 6. Configuração do ambiente

### Backend

```powershell
Copy-Item "Oculos VR backend\.env.example" "Oculos VR backend\.env"
```

Edite o arquivo gerado e ajuste:

```env
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB=oculosvr_db
JWT_SECRET_KEY=troque_por_uma_chave_segura
APP_CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### Frontend

```powershell
Copy-Item "Oculos VR frontend web\.env.example" "Oculos VR frontend web\.env.local"
```

Confirme que `VITE_API_URL` aponta para o backend local:

```env
VITE_API_URL=http://127.0.0.1:8000
```

> **Importante:** nunca versione os arquivos `.env` ou `.env.local`. Eles já estão listados no `.gitignore`.

---

## 7. Instalação

```powershell
# Instala dependências do backend (cria venv Python)
.\scripts\install-backend.ps1

# Instala dependências do frontend (npm install)
.\scripts\install-frontend.ps1
```

Ou manualmente:

```powershell
# Backend
cd "Oculos VR backend"
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt

# Frontend
cd "Oculos VR frontend web"
npm install
```

---

## 8. Execução em desenvolvimento

> **Ordem obrigatória:** suba o backend antes do frontend.

```powershell
# 1. Backend → http://127.0.0.1:8000
.\scripts\run-backend.ps1

# 2. Frontend → http://localhost:3000
.\scripts\run-frontend.ps1
```

Ou manualmente:

```powershell
# Backend
cd "Oculos VR backend"
.venv\Scripts\activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Frontend (em outro terminal)
cd "Oculos VR frontend web"
npm run dev
```

| Serviço | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://127.0.0.1:8000 |
| Swagger UI | http://127.0.0.1:8000/docs |
| ReDoc | http://127.0.0.1:8000/redoc |

---

## 9. Build e testes

### Build do frontend

```powershell
cd "Oculos VR frontend web"
npm run build       # gera a pasta dist/
npm run preview     # pré-visualiza o build
```

### Testes do backend

```powershell
.\scripts\test-backend.ps1
```

Ou manualmente:

```powershell
cd "Oculos VR backend"
.venv\Scripts\activate
pytest
```

A suite cobre **16 testes** distribuídos entre `test_health.py` (6 testes) e `test_auth_flow.py` (10 testes), utilizando `httpx.TestClient` e mocks do MongoDB.

### Verificação de tipos do frontend

```powershell
cd "Oculos VR frontend web"
npm run lint    # executa tsc --noEmit
```

---

## 10. Scripts de automação

Todos os scripts estão em `scripts/` e foram escritos em PowerShell para execução em Windows.

| Script | Descrição |
|---|---|
| `install-backend.ps1` | Cria o ambiente virtual Python e instala `requirements.txt` |
| `install-frontend.ps1` | Executa `npm install` no diretório do frontend |
| `run-backend.ps1` | Ativa o venv e sobe o Uvicorn com hot-reload |
| `run-frontend.ps1` | Executa `npm run dev` na porta 3000 |
| `test-backend.ps1` | Ativa o venv e executa `pytest` |

---

## 11. Arquitetura geral

A aplicação segue uma arquitetura cliente-servidor desacoplada:

```
┌─────────────────────────────────┐
│   Frontend (React SPA)          │
│   localhost:3000                │
│                                 │
│  App.tsx                        │
│   └─ AuthProvider               │
│       └─ Routes                 │
│           ├─ /login → Login     │
│           └─ ProtectedRoute     │
│               └─ /dashboard     │
│                   → Dashboard   │
└────────────┬────────────────────┘
             │ HTTP (Axios + JWT)
             ▼
┌─────────────────────────────────┐
│   Backend (FastAPI)             │
│   127.0.0.1:8000                │
│                                 │
│  main.py → app/main.py          │
│   └─ api/v1/router.py           │
│       ├─ /health/               │
│       ├─ /auth/register         │
│       ├─ /auth/login            │
│       └─ /users/me              │
│                                 │
│  Services → Repositories        │
│                  └─ MongoDB     │
└─────────────────────────────────┘
```

### Backend — camadas

| Camada | Pasta | Responsabilidade |
|---|---|---|
| Rotas | `app/api/v1/routes/` | Recebe requests HTTP, valida entrada, retorna resposta |
| Dependências | `app/api/deps.py` | Injeção de serviços, autenticação de token |
| Serviços | `app/services/` | Regras de negócio (registro, login) |
| Repositórios | `app/repositories/` | Acesso direto ao MongoDB |
| Modelos | `app/models/` | Estrutura dos documentos no banco |
| Schemas | `app/schemas/` | Contratos Pydantic de entrada e saída |
| Core | `app/core/` | Configuração, segurança e gerenciador de banco |

### Frontend — camadas

| Camada | Pasta | Responsabilidade |
|---|---|---|
| Tipos | `src/types/` | Contratos TypeScript compartilhados |
| Serviços | `src/services/` | Configuração do Axios e gerenciamento de token |
| Contexto | `src/contexts/` | Estado global de autenticação |
| Componentes | `src/components/` | ProtectedRoute, loaders reutilizáveis |
| Páginas | `src/pages/` | Login, Dashboard |

---

## 12. Fluxo de autenticação

```
1. Usuário acessa qualquer rota
        │
        ▼
2. AuthContext.restoreSession()
   └─ Há token no localStorage?
       ├─ NÃO → estado: não autenticado
       └─ SIM → GET /users/me
               ├─ Token válido → estado: autenticado (user preenchido)
               └─ Token inválido → limpa token → estado: não autenticado
        │
        ▼
3. ProtectedRoute avalia isAuthenticated
   ├─ loading=true → exibe FullScreenLoader
   ├─ autenticado → renderiza <Outlet /> (Dashboard)
   └─ não autenticado → redireciona para /login
        │
        ▼
4. Login (se necessário)
   └─ POST /auth/login → recebe JWT
       └─ AuthContext.signIn(token)
           └─ GET /users/me → preenche user
               └─ redireciona para /dashboard
        │
        ▼
5. Logout
   └─ AuthContext.signOut()
       └─ limpa token + user
           └─ redireciona para /login
```

---

## 13. Endpoints da API

| Método | Rota | Autenticação | Descrição |
|---|---|---|---|
| GET | `/` | Não | Metadata da API (nome, versão, docs) |
| GET | `/health/` | Não | Status da API e do MongoDB |
| POST | `/auth/register` | Não | Cria novo usuário |
| POST | `/auth/login` | Não | Autentica e retorna JWT |
| GET | `/users/me` | Bearer token | Dados do usuário autenticado |

A documentação interativa completa está disponível em `http://127.0.0.1:8000/docs` (Swagger UI) com o backend em execução.

---

## 14. Variáveis de ambiente

### Backend — `Oculos VR backend/.env`

| Variável | Padrão | Descrição |
|---|---|---|
| `APP_NAME` | `OculosVR Backend` | Nome da aplicação |
| `APP_ENV` | `development` | Ambiente de execução |
| `APP_DEBUG` | `true` | Modo debug |
| `APP_HOST` | `0.0.0.0` | Host de bind do Uvicorn |
| `APP_PORT` | `8000` | Porta do servidor |
| `APP_CORS_ORIGINS` | `http://localhost:3000,...` | Origens permitidas (separadas por vírgula) |
| `MONGODB_URL` | `mongodb://localhost:27017` | URI de conexão ao MongoDB |
| `MONGODB_DB` | `oculosvr_db` | Nome do banco de dados |
| `JWT_SECRET_KEY` | `change_me_in_local_env` | Chave secreta para assinar tokens JWT |
| `JWT_ALGORITHM` | `HS256` | Algoritmo de assinatura JWT |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `60` | Validade do token em minutos |

### Frontend — `Oculos VR frontend web/.env.local`

| Variável | Padrão | Descrição |
|---|---|---|
| `VITE_API_URL` | `http://127.0.0.1:8000` | URL base da API backend |

> Nunca exponha `JWT_SECRET_KEY` em repositórios públicos. Troque o valor padrão antes de qualquer uso em produção.

---

## 15. Primeiro acesso

Como a interface de cadastro ainda não está implementada no frontend, o registro deve ser feito diretamente pela documentação interativa da API:

1. Suba o backend: `.\scripts\run-backend.ps1`
2. Acesse `http://127.0.0.1:8000/docs`
3. Expanda `POST /auth/register` → clique em **Try it out**
4. Informe `email`, `password` e opcionalmente `full_name` e `username`
5. Execute e confirme o retorno `201 Created`
6. Acesse `http://localhost:3000` e faça login com as credenciais cadastradas

---

## 16. Estado atual do projeto

| Funcionalidade | Status |
|---|---|
| Autenticação via JWT | ✅ Implementado |
| Registro de usuário (via Swagger) | ✅ Implementado |
| Proteção de rotas no frontend | ✅ Implementado |
| Persistência de sessão (localStorage) | ✅ Implementado |
| Logout | ✅ Implementado |
| Dashboard inicial | ✅ Implementado (dados parcialmente hardcoded) |
| Suite de testes do backend | ✅ 16 testes automatizados |
| Endpoint de health check | ✅ Implementado |
| Interface de cadastro no frontend | 🔲 Não implementado |
| Métricas reais no Dashboard | 🔲 Hardcoded |
| Navegação do menu lateral | 🔲 Não funcional |
| Páginas de Usuários e Config VR | 🔲 Não implementadas |
| Refresh automático de token | 🔲 Não implementado |

---

## 17. Documentação interna

| Arquivo | Conteúdo |
|---|---|
| `docs/auth-flow.md` | Fluxo de autenticação detalhado e integração entre frontend e backend |
| `Oculos VR backend/README.md` | Documentação técnica completa do módulo backend |
| `Oculos VR frontend web/README.md` | Documentação técnica completa do módulo frontend |

---

## 18. Troubleshooting

**MongoDB não conecta**
Verifique se o serviço MongoDB está em execução. Confirme que `MONGODB_URL` está correto no `.env`. O endpoint `GET /health/` reporta o status do banco com detalhes.

**Erro de CORS no frontend**
Confirme que a origem do frontend (`http://localhost:3000`) está incluída em `APP_CORS_ORIGINS` no `.env` do backend.

**Token inválido ou expirado**
O frontend tentará restaurar a sessão via `GET /users/me`. Se o token estiver expirado, a sessão é limpa automaticamente e o usuário é redirecionado para `/login`.

**`VITE_API_URL` não definida**
O frontend usa `http://127.0.0.1:8000` como fallback. Ainda assim, crie o `.env.local` a partir do `.env.example` para evitar comportamentos inesperados.

**Backend não sobe — porta 8000 em uso**
Encerre o processo que ocupa a porta ou altere `APP_PORT` no `.env` (e atualize `VITE_API_URL` no frontend correspondentemente).

**Frontend não sobe — porta 3000 em uso**
Altere a porta no script `dev` do `package.json` e atualize `APP_CORS_ORIGINS` no backend.

**`JWT_SECRET_KEY` com valor padrão**
O backend aceita o valor padrão `change_me_in_local_env` em desenvolvimento, mas isso representa um risco de segurança. Troque antes de qualquer deploy.

**Dependências do backend desatualizadas**
Execute `pip install -r requirements.txt` com o venv ativado após qualquer atualização do arquivo.

---

## 19. Licença

Nenhum arquivo de licença foi identificado neste repositório. A distribuição e o uso deste código estão sujeitos às definições do proprietário do projeto.
