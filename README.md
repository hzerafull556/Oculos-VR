# OculosVR

Projeto de estudo com backend em FastAPI e frontend web em React para um painel administrativo do OculosVR.

## Estrutura atual

> Neste workspace, as pastas principais continuam com os nomes atuais para evitar mudancas agressivas.

```text
Oculos VR/
|-- Oculos VR backend/        # API FastAPI
|-- Oculos VR frontend web/   # Frontend React + Vite
|-- scripts/                  # Scripts PowerShell para rotina local
|-- .gitignore
`-- README.md
```

## O que existe em cada pasta

- `Oculos VR backend/`: autenticacao, rotas FastAPI, servicos, repositorios e testes.
- `Oculos VR frontend web/`: tela de login, dashboard e consumo do fluxo `/auth/login` + `/users/me`.
- `scripts/`: atalhos simples para instalar dependencias, subir servicos e rodar testes.
- `docs/`: documentacao didatica das etapas implementadas.

## Como preparar o ambiente

### Backend

1. Copie `Oculos VR backend/.env.example` para `Oculos VR backend/.env`.
2. Ajuste o MongoDB e a chave JWT no seu arquivo local.
3. Revise `APP_CORS_ORIGINS` se o frontend rodar em uma origem diferente da padrao.
4. Rode:

```powershell
.\scripts\install-backend.ps1
```

### Frontend

1. Copie `Oculos VR frontend web/.env.example` para `Oculos VR frontend web/.env` ou `.env.local`.
2. Confirme que `VITE_API_URL` aponta para o backend local.
3. Rode:

```powershell
.\scripts\install-frontend.ps1
```

## Como rodar

Subir o backend:

```powershell
.\scripts\run-backend.ps1
```

Subir o frontend:

```powershell
.\scripts\run-frontend.ps1
```

## Ordem recomendada para subir o projeto

1. Suba o backend primeiro.
2. Abra `http://127.0.0.1:8000/docs`.
3. Crie o usuario inicial em `POST /auth/register`.
4. Suba o frontend.
5. Faca login pela interface web em `http://localhost:3000`.

## Como testar

Testes do backend:

```powershell
.\scripts\test-backend.ps1
```

Validacao do frontend:

```powershell
cd ".\Oculos VR frontend web"
npm run lint
npm run build
```

## Endpoints principais do backend

- `POST /auth/register`
- `POST /auth/login`
- `GET /users/me`

## Variaveis de ambiente importantes

- Backend: `MONGODB_URL`, `MONGODB_DB`, `JWT_SECRET_KEY`, `APP_CORS_ORIGINS`
- Frontend: `VITE_API_URL`

## Fluxo atual de autenticacao

1. O usuario inicial e criado manualmente em `/docs` pela rota `POST /auth/register`.
2. O frontend envia o login para `POST /auth/login`.
3. O backend devolve um JWT.
4. O frontend salva o token e consulta `GET /users/me`.
5. O dashboard usa os dados retornados para manter a sessao.

Documentacao complementar:

- `docs/auth-flow.md`

## Observacoes de higiene

- Nao versionar `.env`, `venv`, `.venv`, `node_modules`, `dist`, `__pycache__` e caches de teste.
- Se quiser limpar o projeto localmente, remova artefatos gerados antes de compartilhar ou subir para um repositorio.
