# OculosVR Backend

API do projeto OculosVR feita com FastAPI, MongoDB e testes com `pytest`.

## O que existe aqui

```text
app/
  api/            # Rotas e dependencias HTTP
  core/           # Configuracao, seguranca e banco
  repositories/   # Acesso aos dados
  schemas/        # Entrada e saida da API
  services/       # Regras de negocio
tests/            # Testes automatizados
main.py           # Entrada do uvicorn
```

## Endpoints atuais

- `POST /auth/register`
- `POST /auth/login`
- `GET /users/me`

## Ambiente

1. Copie `.env.example` para `.env`.
2. Ajuste `MONGODB_URL`, `MONGODB_DB` e `JWT_SECRET_KEY`.
3. Revise `APP_CORS_ORIGINS` se o frontend rodar fora de `http://localhost:3000`.

## Variaveis de ambiente importantes

```env
APP_CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

Essa configuracao permite que o frontend web faca login e consulte `/users/me` no navegador durante o desenvolvimento.

## Como instalar dependencias

Na raiz do projeto:

```powershell
.\scripts\install-backend.ps1
```

Se preferir rodar daqui manualmente:

```powershell
py -3 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

## Como rodar

Na raiz do projeto:

```powershell
.\scripts\run-backend.ps1
```

Manual:

```powershell
.\.venv\Scripts\python.exe -m uvicorn main:app --reload
```

## Como testar

Na raiz do projeto:

```powershell
.\scripts\test-backend.ps1
```

Manual:

```powershell
.\.venv\Scripts\python.exe -m pytest -q
```

## Primeiro acesso

1. Suba a API.
2. Abra `http://127.0.0.1:8000/docs`.
3. Execute `POST /auth/register` para criar o usuario inicial.
4. Depois use esse usuario no frontend.
