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

## Como preparar o ambiente

### Backend

1. Copie `Oculos VR backend/.env.example` para `Oculos VR backend/.env`.
2. Ajuste o MongoDB e a chave JWT no seu arquivo local.
3. Rode:

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

## Observacoes de higiene

- Nao versionar `.env`, `venv`, `.venv`, `node_modules`, `dist`, `__pycache__` e caches de teste.
- Se quiser limpar o projeto localmente, remova artefatos gerados antes de compartilhar ou subir para um repositorio.
