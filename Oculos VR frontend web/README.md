# OculosVR Admin — Frontend Web

Painel administrativo web do projeto **TourVR / OculosVR**, construído com React 19, TypeScript, Vite e Tailwind CSS. Consome a API FastAPI do backend e implementa autenticação JWT com proteção de rotas e persistência de sessão.

---

## Sumário

1. [Visão geral](#1-visão-geral)
2. [Objetivo](#2-objetivo)
3. [Stack e tecnologias](#3-stack-e-tecnologias)
4. [Requisitos para execução](#4-requisitos-para-execução)
5. [Instalação](#5-instalação)
6. [Execução em desenvolvimento](#6-execução-em-desenvolvimento)
7. [Build e deploy local](#7-build-e-deploy-local)
8. [Scripts disponíveis](#8-scripts-disponíveis)
9. [Estrutura de pastas](#9-estrutura-de-pastas)
10. [Arquitetura resumida](#10-arquitetura-resumida)
11. [Fluxo atual da aplicação](#11-fluxo-atual-da-aplicação)
12. [Autenticação e controle de acesso](#12-autenticação-e-controle-de-acesso)
13. [Integração com API / backend](#13-integração-com-api--backend)
14. [Variáveis de ambiente](#14-variáveis-de-ambiente)
15. [Convenções e boas práticas identificadas](#15-convenções-e-boas-práticas-identificadas)
16. [Estado atual do projeto](#16-estado-atual-do-projeto)
17. [Limitações e pontos de atenção](#17-limitações-e-pontos-de-atenção)
18. [Próximos passos sugeridos](#18-próximos-passos-sugeridos)
19. [Troubleshooting](#19-troubleshooting)
20. [Guia rápido para novos desenvolvedores](#20-guia-rápido-para-novos-desenvolvedores)
21. [Licença](#21-licença)

---

## 1. Visão geral

Este repositório contém o frontend web do painel administrativo do projeto **OculosVR**, parte do ecossistema **TourVR**. Trata-se de uma SPA (Single Page Application) responsável por:

- autenticar administradores via credenciais (e-mail e senha) junto ao backend FastAPI;
- manter e restaurar sessão autenticada entre recarregamentos de página via token JWT armazenado em `localStorage`;
- proteger rotas que exigem autenticação;
- exibir um painel inicial com dados do usuário autenticado e métricas do ambiente VR.

A aplicação não possui lógica de negócio própria — ela depende integralmente da API REST fornecida pelo backend.

---

## 2. Objetivo

A finalidade principal da aplicação é fornecer uma interface administrativa web para o projeto OculosVR. O escopo atual identificado no código cobre:

- fluxo completo de autenticação (login, persistência de sessão e logout);
- rota protegida `/dashboard` acessível apenas a usuários autenticados;
- exibição dos dados do usuário retornados pelo endpoint `GET /users/me`;
- estrutura base de navegação lateral preparada para expansão.

---

## 3. Stack e tecnologias

| Categoria               | Tecnologia / Versão                      |
|-------------------------|------------------------------------------|
| Framework UI            | React 19                                 |
| Linguagem               | TypeScript ~5.8                          |
| Build tool              | Vite 6.2                                 |
| Roteamento              | React Router DOM 7.13                    |
| Requisições HTTP        | Axios 1.13                               |
| Gerenciamento de estado | React Context API (built-in)             |
| Estilização             | Tailwind CSS 4.1 (via plugin Vite)       |
| Ícones                  | Lucide React 0.546                       |
| Tipagem de ambiente     | `vite/client` (via `vite-env.d.ts`)      |

> **Tailwind via plugin Vite:** a versão 4 do Tailwind não usa `tailwind.config.js` — a integração ocorre diretamente no `vite.config.ts` via `@tailwindcss/vite`.

---

## 4. Requisitos para execução

- **Node.js** 20 ou superior (recomendado: LTS mais recente)
- **npm** 10+ (incluso no Node.js 20)
- **Backend OculosVR** em execução e acessível (ver seção [Integração com API](#13-integração-com-api--backend))

---

## 5. Instalação

```bash
# 1. Clone o repositório principal (se ainda não tiver feito)
git clone <url-do-repositorio>
cd "Oculos VR/Oculos VR frontend web"

# 2. Instale as dependências
npm install

# 3. Configure o ambiente
cp .env.example .env.local
```

Edite `.env.local` e ajuste a URL do backend:

```env
VITE_API_URL=http://127.0.0.1:8000
```

> Se você estiver usando os scripts PowerShell do projeto raiz, o processo é equivalente a rodar `.\scripts\install-frontend.ps1` a partir da raiz do monorepo.

---

## 6. Execução em desenvolvimento

```bash
npm run dev
```

O servidor de desenvolvimento sobe na porta **3000**, acessível em:

- `http://localhost:3000`
- `http://127.0.0.1:3000`

O flag `--host=0.0.0.0` está configurado no script `dev`, então a aplicação também é acessível na rede local pelo IP da máquina.

> O backend precisa estar rodando e a variável `VITE_API_URL` precisa apontar para ele. Caso o backend esteja em outra porta ou host, ajuste `.env.local` antes de iniciar.

---

## 7. Build e deploy local

```bash
# Gerar build de produção
npm run build

# Pré-visualizar o build gerado
npm run preview

# Remover a pasta dist gerada
npm run clean
```

O build de produção é gerado na pasta `dist/`. O comando `preview` serve o conteúdo dessa pasta localmente para validação antes de um deploy real.

---

## 8. Scripts disponíveis

| Script          | Comando executado                                              | Finalidade                                                  |
|-----------------|----------------------------------------------------------------|-------------------------------------------------------------|
| `dev`           | `vite --port=3000 --host=0.0.0.0`                             | Inicia o servidor de desenvolvimento na porta 3000          |
| `build`         | `vite build`                                                   | Gera o bundle otimizado de produção em `dist/`              |
| `preview`       | `vite preview`                                                 | Serve o build de produção localmente para inspeção          |
| `clean`         | Remove recursivamente a pasta `dist/`                          | Limpa artefatos de build anteriores                         |
| `lint`          | `tsc --noEmit`                                                 | Verificação de tipos TypeScript sem emitir arquivos         |

> Não há configuração de ESLint ou Prettier neste projeto. A checagem de qualidade de código é feita exclusivamente via TypeScript (`tsc --noEmit`).

---

## 9. Estrutura de pastas

```text
Oculos VR frontend web/
├── index.html                  # Ponto de entrada HTML (monta #root)
├── vite.config.ts              # Configuração do Vite (plugins e alias @)
├── tsconfig.json               # Configuração TypeScript
├── vite-env.d.ts               # Referência de tipos para variáveis de ambiente Vite
├── package.json
├── .env.example                # Modelo de variáveis de ambiente
└── src/
    ├── main.tsx                # Ponto de entrada React (monta <App> no DOM)
    ├── App.tsx                 # Roteador raiz e providers globais
    ├── index.css               # Import global do Tailwind CSS
    ├── types/
    │   └── index.ts            # Interfaces TypeScript compartilhadas
    ├── services/
    │   └── api.ts              # Instância Axios, funções de token e interceptor
    ├── contexts/
    │   └── AuthContext.tsx     # Estado global de autenticação e restauração de sessão
    ├── components/
    │   ├── ProtectedRoute.tsx  # Guard de rotas autenticadas
    │   └── FullScreenLoader.tsx # Componente de carregamento em tela cheia
    └── pages/
        ├── Login.tsx           # Tela de login
        └── Dashboard.tsx       # Painel principal autenticado
```

---

## 10. Arquitetura resumida

### Ponto de entrada

`src/main.tsx` monta o componente `<App>` dentro de `<StrictMode>` no elemento `#root` do `index.html`. É o único arquivo que toca o DOM diretamente.

### Papel do App

`src/App.tsx` é o componente raiz da aplicação. Ele define:

1. **`<BrowserRouter>`** — habilita o roteamento baseado em histórico do navegador;
2. **`<AuthProvider>`** — envolve toda a árvore de rotas com o contexto de autenticação, garantindo que qualquer componente tenha acesso ao estado de sessão;
3. **`<Routes>`** — declara as três rotas da aplicação.

### Camadas da aplicação

```
index.html
  └── main.tsx              ← montagem React
        └── App.tsx         ← roteador + providers
              ├── AuthProvider (contexts/)    ← estado global de auth
              ├── /login → Login (pages/)     ← tela pública
              └── ProtectedRoute (components/) ← guard de acesso
                    └── /dashboard → Dashboard (pages/)  ← tela privada
```

**`services/`** — camada de infraestrutura HTTP. Isola a configuração do Axios, as funções de manipulação de token e o interceptor de requisição. Não contém lógica de negócio.

**`contexts/`** — gerenciamento de estado global. O `AuthContext` é o único contexto existente; ele expõe `user`, `isAuthenticated`, `loading`, `signIn` e `signOut` para toda a árvore abaixo de `AuthProvider`.

**`components/`** — componentes reutilizáveis sem vínculo a uma página específica. Atualmente dois: `ProtectedRoute` (guard) e `FullScreenLoader` (UI de espera).

**`pages/`** — componentes de nível de rota. Cada página consome o contexto e os serviços necessários diretamente, sem camada intermediária de estado local dedicada.

**`types/`** — contratos TypeScript que descrevem os dados trafegados entre frontend e backend (`User`, `AuthResponse`, `LoginPayload`).

A arquitetura é intencionalm**ente simples**: não há gerenciador de estado externo (Redux, Zustand, etc.), não há camada de cache de requisições (React Query, SWR) e não há módulos de feature isolados. A separação por tipo de arquivo (`pages/`, `components/`, `contexts/`, `services/`) é adequada ao tamanho atual do projeto.

---

## 11. Fluxo atual da aplicação

```
Usuário acessa qualquer URL
  │
  ├─► App.tsx monta AuthProvider
  │     └─► AuthContext executa restoreSession() (useEffect na montagem)
  │           ├─ Lê token do localStorage (@OculosVR:token)
  │           │
  │           ├─ [Token ausente] → loading = false, user = null
  │           │
  │           └─ [Token presente] → chama GET /users/me
  │                 ├─ [Sucesso]  → user = dados retornados, loading = false
  │                 └─ [Falha]   → clearAuthToken(), user = null, loading = false
  │
  ├─► ProtectedRoute avalia estado
  │     ├─ loading = true  → exibe <FullScreenLoader>
  │     ├─ isAuthenticated → renderiza <Outlet> (Dashboard)
  │     └─ não autenticado → <Navigate to="/login">
  │
  ├─► Login (rota /login)
  │     ├─ Já autenticado → <Navigate to="/dashboard">
  │     └─ Formulário submetido
  │           └─► POST /auth/login → recebe access_token
  │                 └─► signIn(token)
  │                       └─► setAuthToken + GET /users/me
  │                             └─► navigate("/dashboard")
  │
  └─► Dashboard (rota /dashboard)
        └─► Exibe nome do usuário, métricas e dados brutos de /users/me
              └─► Botão "Sair" → signOut() + navigate("/login")
```

---

## 12. Autenticação e controle de acesso

### Login

A tela `Login.tsx` envia um `POST /auth/login` com `{ email, password }` no corpo como JSON. O backend retorna `{ access_token, token_type }`.

### Armazenamento do token

O token JWT é armazenado em **`localStorage`** sob a chave `@OculosVR:token` (definida como constante `TOKEN_STORAGE_KEY` em `services/api.ts`). Não há uso de cookies ou `sessionStorage`.

### Carregamento do usuário autenticado

Após receber o token (no login ou na restauração de sessão), a função `syncUserFromToken()` do `AuthContext`:

1. chama `setAuthToken(token)` — salva no `localStorage` e define o header `Authorization: Bearer <token>` na instância Axios;
2. faz `GET /users/me` para obter os dados do usuário autenticado;
3. em caso de erro (token expirado ou inválido), limpa o token e define `user = null`.

### Persistência de sessão

No `useEffect` executado na montagem do `AuthProvider`, a função `restoreSession()` lê o token salvo no `localStorage`. Se existir, tenta validá-lo via `GET /users/me`. Isso garante que o usuário continue autenticado após recarregar a página.

### Logout

`signOut()` no `AuthContext`:

1. chama `clearAuthToken()` — remove o token do `localStorage` e deleta o header `Authorization` da instância Axios;
2. define `user = null`.

O componente `Dashboard` chama `signOut()` e em seguida redireciona para `/login` via `navigate`.

### Proteção de rotas

`ProtectedRoute.tsx` é um componente intermediário que envolve rotas privadas via `<Outlet>`. Sua lógica:

- enquanto `loading = true` → exibe `<FullScreenLoader>` (evita flash de redirecionamento);
- se `isAuthenticated = false` → redireciona para `/login` com `replace`;
- se `isAuthenticated = true` → renderiza o conteúdo da rota (`<Outlet>`).

### Relação frontend ↔ backend

O frontend não gera nem valida tokens — ele apenas os armazena e os repassa nas requisições. Toda a lógica de autenticação (geração de JWT, validação, expiração) é responsabilidade do backend.

---

## 13. Integração com API / backend

### Configuração base

O arquivo `src/services/api.ts` centraliza toda a configuração HTTP:

```typescript
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
});
```

A URL base é lida da variável de ambiente `VITE_API_URL`. Um valor padrão `http://127.0.0.1:8000` é usado como fallback caso a variável não esteja definida.

### Interceptor de requisição

Um interceptor em `api.ts` adiciona automaticamente o header `Authorization: Bearer <token>` a todas as requisições, lendo o token do `localStorage` a cada chamada:

```typescript
api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Endpoints consumidos

| Método | Endpoint         | Onde é chamado                        | Finalidade                           |
|--------|------------------|---------------------------------------|--------------------------------------|
| POST   | `/auth/login`    | `Login.tsx` (handleLogin)             | Autentica e retorna JWT              |
| GET    | `/users/me`      | `AuthContext` (syncUserFromToken)     | Busca dados do usuário autenticado   |

### Tratamento de erros

Em `Login.tsx`, erros de autenticação são tratados lendo `error.response?.data?.detail` (formato de erro do FastAPI). Se a propriedade não existir, uma mensagem genérica é exibida. Não há tratamento centralizado de erros (interceptor de resposta) implementado no projeto.

### Dependências de backend

- O backend precisa expor CORS para a origem do frontend (`http://localhost:3000` por padrão).
- O backend precisa estar acessível na URL configurada em `VITE_API_URL`.
- O formato de resposta esperado está tipado em `src/types/index.ts`.

---

## 14. Variáveis de ambiente

O projeto usa o sistema de variáveis de ambiente nativo do Vite. Variáveis devem ter o prefixo `VITE_` para serem expostas ao código do cliente.

| Variável       | Obrigatória | Valor padrão              | Finalidade                                         |
|----------------|-------------|---------------------------|----------------------------------------------------|
| `VITE_API_URL` | Não         | `http://127.0.0.1:8000`  | URL base do backend FastAPI                        |

O arquivo `.env.example` está presente no repositório e serve como modelo:

```env
# URL base do backend FastAPI local.
VITE_API_URL=http://127.0.0.1:8000
```

Para configurar localmente:

```bash
cp .env.example .env.local
```

> `.env.local` é ignorado pelo Git. Nunca comite arquivos `.env` com valores reais.

---

## 15. Convenções e boas práticas identificadas

**Separação de responsabilidades clara**
Cada pasta em `src/` tem uma função única e bem definida: tipos, serviços, contexto, componentes e páginas não se misturam.

**Centralização da camada HTTP**
Toda comunicação com o backend passa por `services/api.ts`. Nenhuma página importa `axios` diretamente — elas usam a instância `api` já configurada.

**TypeScript estrito**
Todos os dados trafegados entre frontend e backend possuem interfaces definidas em `src/types/index.ts`. O `tsconfig.json` configura `target: ES2022` e `moduleResolution: bundler`, alinhado ao Vite.

**Alias de importação**
O alias `@` está configurado tanto no `vite.config.ts` quanto no `tsconfig.json`, mapeando para a raiz do projeto. Isso evita caminhos relativos longos.

**Guard de rotas com loading state**
`ProtectedRoute` aguarda a resolução do estado de autenticação antes de decidir redirecionar ou renderizar. Isso evita o comportamento de "flash" onde o usuário autenticado veria brevemente a tela de login.

**Constante de chave de storage**
A chave do `localStorage` é definida como constante (`TOKEN_STORAGE_KEY`) em vez de string literal repetida, facilitando refatorações futuras.

**Hook de contexto com validação**
`useAuth()` lança um erro explícito se usado fora do `AuthProvider`, prevenindo erros silenciosos de contexto nulo em tempo de desenvolvimento.

**Componente de loading reutilizável**
`FullScreenLoader` aceita uma prop `message` opcional, permitindo personalização sem duplicação.

---

## 16. Estado atual do projeto

Com base no código presente no repositório, as seguintes funcionalidades estão implementadas e operacionais:

- **Login via e-mail e senha** — formulário funcional com validação de campos e exibição de erros do backend
- **Autenticação JWT** — token recebido, armazenado e enviado automaticamente nas requisições
- **Persistência de sessão** — sessão restaurada ao recarregar a página via token no `localStorage`
- **Validação de token na inicialização** — token salvo é verificado contra `GET /users/me` antes de qualquer renderização protegida
- **Proteção de rotas** — `/dashboard` inacessível sem autenticação válida
- **Logout** — limpa token do `localStorage` e do header Axios, redireciona para login
- **Dashboard inicial** — exibe nome do usuário autenticado, métricas estáticas e dados brutos de `/users/me`
- **Redirecionamento automático** — rotas não mapeadas redirecionam para `/dashboard`; usuário já autenticado que acessa `/login` é redirecionado para `/dashboard`
- **Integração com backend** — comunicação real com a API FastAPI via Axios

---

## 17. Limitações e pontos de atenção

**Métricas do dashboard são hardcoded**
Os valores exibidos nos cards ("124 Usuários Ativos", "12 Ambientes VR", "89 Sessões Hoje") e os itens de navegação lateral são constantes estáticas definidas diretamente em `Dashboard.tsx`. Não há integração com endpoints reais para esses dados.

**Itens de navegação lateral não são roteáveis**
"Usuários" e "Configurações VR" aparecem no menu mas não possuem rotas, páginas ou funcionalidade implementada.

**Sem tratamento centralizado de erros HTTP**
Não há interceptor de resposta Axios para tratar erros globais (401, 403, 500, etc.). Um token expirado durante a sessão causará falha silenciosa nas chamadas, sem redirecionamento automático para o login.

**Token sem verificação de expiração no cliente**
O JWT não é decodificado no frontend para verificar `exp`. A validação ocorre apenas via chamada ao backend (`GET /users/me`), o que significa que um token expirado só é detectado na inicialização ou em chamadas que falham.

**Sem tela de cadastro público**
O registro de novos usuários é feito exclusivamente via Swagger (`/docs`). A tela de login inclusive exibe um aviso sobre isso.

**Ausência de ESLint / Prettier**
O projeto não possui configuração de linter de código além do `tsc --noEmit`. Não há enforcement de estilo de código automatizado.

**Dependência total do backend**
A aplicação é não-funcional sem o backend em execução. Não há modo offline, mocking ou dados de fallback.

---

## 18. Próximos passos sugeridos

As sugestões abaixo são coerentes com o estado atual do código:

1. **Interceptor de resposta para token expirado** — adicionar um interceptor Axios que, ao receber 401, chame `signOut()` e redirecione para `/login` automaticamente.

2. **Integrar métricas reais ao dashboard** — substituir os valores hardcoded por chamadas a endpoints reais da API assim que estiverem disponíveis.

3. **Implementar as páginas de navegação** — criar rotas e páginas para "Usuários" e "Configurações VR", que já aparecem no menu lateral.

4. **Adicionar ESLint** — configurar `eslint` com as regras recomendadas para React e TypeScript para manter consistência de código.

5. **Proteger múltiplas rotas por papel** — o modelo de dados `User` já possui o campo `role`. Um segundo nível de guard baseado em role pode ser construído sobre o `ProtectedRoute` atual.

6. **Extrair chamadas de API para camada de serviços** — centralizar as chamadas específicas (ex: `authService.login()`, `userService.getMe()`) em `services/` em vez de chamar `api.post/get` diretamente nas páginas.

---

## 19. Troubleshooting

**`Erro ao validar token salvo` no console ao carregar**
O token salvo em `localStorage` foi rejeitado pelo backend (expirado ou inválido). O `AuthContext` limpa o token automaticamente. Faça login novamente.

**Tela de login não aparece / redirecionamento em loop**
Verifique se `VITE_API_URL` está configurado corretamente em `.env.local`. Se a variável estiver ausente, o fallback `http://127.0.0.1:8000` é usado.

**`Network Error` ou `ERR_CONNECTION_REFUSED` ao fazer login**
O backend não está em execução ou está em uma porta diferente da configurada em `VITE_API_URL`. Verifique se o servidor FastAPI está rodando.

**Erro CORS ao fazer requisições**
O backend não incluiu a origem do frontend (`http://localhost:3000`) em `APP_CORS_ORIGINS`. Ajuste a configuração do backend e reinicie-o.

**`"Credenciais inválidas. Tente novamente."` ao fazer login**
O usuário ainda não foi cadastrado no backend. Acesse `http://127.0.0.1:8000/docs`, execute `POST /auth/register` e tente novamente.

**`useAuth deve ser usado dentro de AuthProvider`**
Um componente está tentando usar `useAuth()` fora da árvore do `AuthProvider`. Verifique se o componente está dentro de `<App>` (que envolve tudo com `<AuthProvider>`).

**Build falha com erro TypeScript**
Execute `npm run lint` para identificar os erros de tipo antes do build. O Vite não bloqueia o build por erros de tipo por padrão, mas `tsc --noEmit` os expõe.

**Porta 3000 já em uso**
Encerre o processo que ocupa a porta ou altere a porta no script `dev` em `package.json`.

---

## 20. Guia rápido para novos desenvolvedores

Para compreender esta base rapidamente, siga esta ordem de leitura:

1. **`src/types/index.ts`** — entenda os contratos de dados (`User`, `AuthResponse`, `LoginPayload`) antes de qualquer outra coisa.

2. **`src/services/api.ts`** — veja como o Axios está configurado, como o token é armazenado e como o header de autorização é injetado automaticamente.

3. **`src/contexts/AuthContext.tsx`** — entenda o estado global de autenticação: como a sessão é restaurada, como `signIn` e `signOut` funcionam e o que é exposto via `useAuth()`.

4. **`src/App.tsx`** — veja como as rotas estão organizadas e a relação entre `AuthProvider`, `ProtectedRoute` e as páginas.

5. **`src/components/ProtectedRoute.tsx`** — entenda o mecanismo de guard que protege rotas privadas.

6. **`src/pages/Login.tsx`** — veja o fluxo completo de login, desde o submit do formulário até o redirecionamento.

7. **`src/pages/Dashboard.tsx`** — veja como os dados do usuário são consumidos do contexto e como o logout está implementado.

Para rodar localmente, o mínimo necessário é:

```bash
cp .env.example .env.local
npm install
npm run dev
```

E ter o backend OculosVR rodando em `http://127.0.0.1:8000`.

---

## 21. Licença

Este repositório não possui um arquivo de licença definido. O uso, distribuição e modificação do código estão sujeitos aos termos acordados entre os mantenedores do projeto TourVR / OculosVR.
