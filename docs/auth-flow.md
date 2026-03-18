# Fluxo de Autenticacao e Integracao Atual

## Resumo da etapa

Esta etapa fecha a integracao do MVP que ja existia no projeto. O objetivo nao foi criar novas features, e sim garantir que o fluxo atual funcione de ponta a ponta entre frontend e backend.

Os dois ajustes principais foram:

- adicionar CORS no backend para permitir requisicoes do frontend web em desenvolvimento;
- corrigir a dependencia `passlib`, que ja era usada pelo backend para hash de senha.

Com isso, o fluxo `login -> token -> /users/me -> dashboard` fica coerente para estudo e execucao local.

## Arquivos envolvidos e papel de cada um

### Backend

- `Oculos VR backend/app/core/config.py`
  Centraliza configuracoes do projeto. Agora tambem le `APP_CORS_ORIGINS` e converte a string do `.env` em lista para o FastAPI.

- `Oculos VR backend/app/main.py`
  Cria a aplicacao FastAPI. Foi aqui que o middleware de CORS foi registrado para liberar o frontend local.

- `Oculos VR backend/app/core/security.py`
  Reune hash, verificacao de senha e JWT. A dependencia `passlib` existe porque ela padroniza o uso do bcrypt nesse fluxo.

- `Oculos VR backend/tests/test_health.py`
  Garante que a API responde a um preflight de CORS para a origem do frontend.

- `Oculos VR backend/requirements.txt`
  Lista de dependencias Python. Agora inclui `passlib`.

### Frontend

- `Oculos VR frontend web/src/pages/Login.tsx`
  Continua fazendo o login normalmente, mas agora mostra uma orientacao de primeiro acesso explicando que o cadastro inicial ainda acontece via Swagger em `/docs`.

## Fluxo da funcionalidade

1. O usuario abre o frontend em `http://localhost:3000`.
2. A tela de login envia `POST /auth/login` para o backend.
3. Como frontend e backend estao em origens diferentes, o navegador faz a verificacao de CORS.
4. O FastAPI responde permitindo a origem configurada em `APP_CORS_ORIGINS`.
5. Com o login aprovado, o frontend salva o token JWT.
6. Em seguida, o frontend chama `GET /users/me` com `Authorization: Bearer <token>`.
7. O backend valida o token, busca o usuario no MongoDB e devolve os dados publicos.
8. O `AuthContext` guarda o usuario em memoria e o dashboard usa essas informacoes.

## Como backend, frontend e banco se conectam nesta etapa

- O frontend conversa com o backend via Axios, usando `VITE_API_URL`.
- O backend usa JWT para autenticar o usuario entre as requisicoes.
- O backend busca os dados reais do usuario no MongoDB antes de responder `/users/me`.
- O CORS nao altera o banco nem o contrato da API; ele apenas permite que o navegador aceite a comunicacao entre as duas aplicacoes durante o desenvolvimento.

## Como estudar essa implementacao depois

Uma boa ordem de estudo e:

1. ler `src/pages/Login.tsx` para entender como o login comeca no frontend;
2. ler `src/contexts/AuthContext.tsx` para ver onde token e usuario ficam centralizados;
3. ler `app/api/v1/routes/auth.py` e `app/services/user_service.py` para seguir o login no backend;
4. ler `app/core/security.py` para entender hash e JWT;
5. ler `app/api/deps.py` e `app/api/v1/routes/users.py` para entender como `/users/me` identifica o usuario autenticado;
6. por fim, ler `app/core/config.py` e `app/main.py` para entender como a configuracao de CORS entra no fluxo.

## Validacao manual sugerida

1. configurar `Oculos VR backend/.env`;
2. rodar o backend;
3. acessar `http://127.0.0.1:8000/docs`;
4. criar um usuario com `POST /auth/register`;
5. rodar o frontend;
6. fazer login pela interface web;
7. confirmar que o dashboard mostra os dados vindos de `/users/me`.
