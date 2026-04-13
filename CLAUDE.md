# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

EMBRAPII - Hub de Soluções Inteligentes is a web portal that serves as a centralized access point to all EMBRAPII institutional applications and systems. The frontend is a React SPA that communicates with N8N webhook workflows for backend operations.

## Development Commands

```bash
npm run dev          # Development server on port 8080
npm run build        # Production build
npm run test         # Run tests once
npm run test:watch   # Watch mode for tests
npm run lint         # ESLint check
```

## Architecture

```
React SPA (Vite) → N8N Webhooks → PostgreSQL
```

**Tech Stack**: React 18, Vite 5, TypeScript, TanStack Query, shadcn/ui (Radix UI), Tailwind CSS, React Router v6

**Backend**: N8N webhooks at `VITE_N8N_BASE_URL` (no traditional API server)

## Key Files

- `src/App.tsx` - Root component with QueryClientProvider and routing setup
- `src/config/routes.ts` - Centralized route paths and N8N webhook endpoints
- `src/services/aplicacoesApi.ts` - Applications API service
- `src/hooks/useAplicacoes.ts` - Main data fetching hook using TanStack Query
- `src/types/aplicacao.ts` - Core data types (Aplicacao, CategoriaAplicacao)

## Routes

| Path | Page | Purpose |
|------|------|---------|
| `/` | HubHome | Applications showcase |
| `/admin/aplicacoes` | AdminAppList | Admin - list applications |
| `/admin/aplicacoes/novo` | AdminAppCreate | Admin - create application |
| `/admin/aplicacoes/:id` | AdminAppEdit | Admin - edit application |
| `/dev/token-exchange` | TokenExchangeTest | Dev - token exchange testing |
| `/login` | Login | Authentication page |

## Environment Variables

All client-side env vars must be prefixed with `VITE_`. Key variables:

- `VITE_N8N_BASE_URL` - N8N webhook base URL
- `VITE_N8N_API_KEY` - N8N authentication token
- `VITE_MOCK_AUTH` - Enable mock authentication (true in dev)
- `VITE_KEYCLOAK_URL` - Keycloak server URL
- `VITE_KEYCLOAK_REALM` - Keycloak realm
- `VITE_KEYCLOAK_CLIENT_ID` - Keycloak client ID
- `VITE_APP_ENV` - development | staging | production

See `envexample` for full list.

## Path Alias

`@/*` maps to `./src/*` (configured in tsconfig.json and vite.config.ts)

## Code Conventions

### TypeScript
- Prefer interfaces for objects, avoid `any` (use `unknown`)
- Props interfaces use `Props` suffix (e.g., `ButtonProps`)
- PascalCase for types/interfaces, camelCase for variables

### React
- Functional components only with hooks
- Use custom hooks for reusable logic
- shadcn/ui components are in `src/components/ui/`

### Git Workflow
- Commit format: `type(scope): description`
- Types: feat, fix, docs, style, refactor, test, chore
- Branches: feature/*, release/*, hotfix/* (Gitflow)

## Docker

Multi-stage Dockerfile builds with nginx serving on port 8000. Use `docker compose` (not `docker-compose`).

```bash
docker compose up --build   # Local container build and run
```

## CI/CD

GitHub Actions workflow in `.github/workflows/cicd.yml`:
- `dev` branch → Development namespace
- `hmg` branch → Staging namespace
- `master` branch → Production namespace (with auto-rollback)

## Database (PostgreSQL)

SQL scripts in `sql/` directory:
- `001_create_tables.sql` - Creates `categorias` and `aplicacoes` tables

## Core Domain Types

```typescript
interface Aplicacao {
  id: string;
  nome: string;
  descricao: string;
  descricaoCurta: string;
  url: string;
  urlExterna: boolean;
  metodoHttp: "GET" | "POST";
  categoria: CategoriaAplicacao;
  status: "ativo" | "inativo" | "manutencao";
  icone: string;
  corDestaque?: string;
  ordem: number;
  visivel: boolean;
  destaque: boolean;
  rolesPermitidas?: string[];
}

type CategoriaAplicacao =
  | "inteligencia-artificial"
  | "gestao"
  | "relatorios"
  | "comunicacao"
  | "integracao"
  | "outros";
```
