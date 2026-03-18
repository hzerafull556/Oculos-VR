# OculosVR

Painel administrativo para o OculosVR — backend em **FastAPI + MongoDB** e frontend em **React + Vite + Tailwind CSS**.

## Stack

| Camada    | Tecnologia                               |
|-----------|------------------------------------------|
| Backend   | Python 3 · FastAPI · Uvicorn · pymongo   |
| Auth      | JWT (python-jose) · bcrypt (passlib)     |
| Frontend  | React 19 · TypeScript · Vite · Axios     |
| Estilo    | Tailwind CSS v4                          |
| Testes    | pytest                                   |

## Estrutura

```text
Oculos VR/
├── Oculos VR backend/    # API FastAPI
├── Oculos VR frontend web/  # SPA React + Vite
├── docs/                 # Documentação das etapas
├── scripts/              # Automação local (PowerShell)
├── .gitignore
└── README.md
```

## Pré-requisitos

- Python 3.11+
- Node.js 20+
- MongoDB (local ou Atlas)

## Configuração do ambiente

### Backend

1. Copie o arquivo de exemplo e edite as variáveis:
   ```powershell
   Copy-Item "Oculos VR backend\.env.example" "Oculos VR backend\.env"
   ```
2. Ajuste `MONGODB_URL`, `MONGODB_DB` e `JWT_SECRET_KEY`.
3. Revise `APP_CORS_ORIGINS` se o frontend rodar em outra porta.

### Frontend

1. Copie o arquivo de exemplo:
   ```powershell
   Copy-Item "Oculos VR frontend web\.env.example" "Oculos VR frontend web\.env.local"
   ```
2. Confirme que `VITE_API_URL` aponta para o backend local (padrão: `http://127.0.0.1:8000`).

## Instalação

```powershell
.\scripts\install-backend.ps1
.\scripts\install-frontend.ps1
```

## Executar

```powershell
# 1. Backend
.\scripts\run-backend.ps1
# → http://127.0.0.1:8000  |  Swagger: http://127.0.0.1:8000/docs

# 2. Frontend
.\scripts\run-frontend.ps1
# → http://localhost:3000
```

> Suba sempre o backend antes do frontend.

## Primeiro acesso

1. Com o backend rodando, abra `http://127.0.0.1:8000/docs`.
2. Execute `POST /auth/register` para criar o usuário inicial.
3. Faça login pelo frontend em `http://localhost:3000`.

## Endpoints da API

| Método | Rota               | Descrição                        |
|--------|--------------------|----------------------------------|
| POST   | `/auth/register`   | Cria usuário                     |
| POST   | `/auth/login`      | Autentica e retorna JWT          |
| GET    | `/users/me`        | Dados do usuário autenticado     |

## Fluxo de autenticação

```
Login (email + senha)
  └─► POST /auth/login
        └─► JWT retornado
              └─► GET /users/me
                    └─► AuthContext mantém sessão
                          └─► Dashboard renderizado
```

## Testes

```powershell
# Rodar suite de testes do backend
.\scripts\test-backend.ps1

# Validar o frontend (type-check + build)
cd ".\Oculos VR frontend web"
npm run lint
npm run build
```

## Variáveis de ambiente

**Backend** (`Oculos VR backend/.env`)

| Variável            | Descrição                              |
|---------------------|----------------------------------------|
| `MONGODB_URL`       | URI de conexão ao MongoDB              |
| `MONGODB_DB`        | Nome do banco de dados                 |
| `JWT_SECRET_KEY`    | Chave secreta para assinar tokens JWT  |
| `APP_CORS_ORIGINS`  | Origens permitidas pelo CORS           |

**Frontend** (`Oculos VR frontend web/.env.local`)

| Variável        | Descrição               |
|-----------------|-------------------------|
| `VITE_API_URL`  | URL base do backend     |

## Documentação

- `docs/auth-flow.md` — fluxo de autenticação detalhado

## Higiene do repositório

Nunca versionar: `.env`, `.venv`, `node_modules`, `dist`, `__pycache__`, `.pytest_cache`.
