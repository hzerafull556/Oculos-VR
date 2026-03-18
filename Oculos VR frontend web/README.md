# OculosVR Frontend

Frontend web do painel administrativo do projeto OculosVR, feito com React, Vite, Tailwind CSS e Axios.

## O que existe aqui

- `src/pages/`: telas como login e dashboard
- `src/contexts/`: estado global de autenticacao
- `src/services/`: configuracao do Axios
- `src/types/`: tipos usados no app

## Ambiente

1. Copie `.env.example` para `.env` ou `.env.local`.
2. Confirme que a URL do backend aponta para o FastAPI local.
3. Confirme que o backend liberou a origem do frontend em `APP_CORS_ORIGINS`.

Exemplo:

```env
VITE_API_URL=http://127.0.0.1:8000
```

## Como instalar dependencias

Na raiz do projeto:

```powershell
.\scripts\install-frontend.ps1
```

Ou manualmente:

```powershell
npm install
```

## Como rodar

Na raiz do projeto:

```powershell
.\scripts\run-frontend.ps1
```

Ou manualmente:

```powershell
npm run dev
```

## Como validar

```powershell
npm run lint
npm run build
```

## Fluxo atual de autenticacao

- `POST /auth/login`
- `GET /users/me`

## Primeiro acesso ao sistema

Como ainda nao existe tela publica de cadastro neste MVP:

1. suba o backend;
2. abra `http://127.0.0.1:8000/docs`;
3. crie o usuario em `POST /auth/register`;
4. depois volte ao frontend e faca login.

## Como a integracao funciona

1. a tela de login envia email e senha para `POST /auth/login`;
2. o backend responde com um token JWT;
3. o frontend salva o token e chama `GET /users/me`;
4. o `AuthContext` guarda o usuario autenticado;
5. o dashboard consome esses dados.
