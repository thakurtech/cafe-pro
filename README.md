# Restaurant OS

Multi-tenant restaurant/cafe operating and revenue platform.

## Stack

- Next.js 16 App Router for web applications
- Express 5 + Node.js for the backend API
- Supabase for Postgres, Auth, Storage and Realtime
- TypeScript across the repository
- pnpm workspaces + Turborepo for monorepo orchestration

## Repository structure

```text
apps/
  merchant-web/       Merchant dashboard + POS/KOT/KDS workflows
  customer-web/       Customer-facing cafe/restaurant storefronts
  platform-admin/     Internal platform administration
  api/                Express API

packages/
  ui/                 Shared UI primitives
  types/              Shared TypeScript domain types
  validation/         Zod schemas and input validation
  config/             Shared runtime/config helpers
  db/                 Supabase client + generated DB types
  auth/               Auth/session helpers
  domain/             Domain services, business rules, event contracts
  api-client/         Typed API client used by web apps
  eslint-config/      Shared lint rules
  tsconfig/           Shared TypeScript configs

supabase/
  migrations/         SQL schema migrations
  seed/               Local development seed data
  functions/          Optional Supabase Edge Functions (only when justified)

docs/                  Product source of truth
architecture/           Technical source of truth
backlog/               Engineering epics/issues
```

## Core architectural rule

The **order** is the central business object. POS, QR/web ordering, aggregators, payment, inventory, kitchen, loyalty and customer analytics consume the same order lifecycle.

## Local development

Prerequisites:

- Node.js 22+
- pnpm 10+
- Docker Desktop
- Supabase CLI

```bash
pnpm install
cp .env.example .env
supabase start
pnpm db:reset
pnpm dev
```

Expected local apps:

- Merchant: http://localhost:3000
- Customer: http://localhost:3001
- Platform admin: http://localhost:3002
- API: http://localhost:4000

## Product source of truth

Read these before implementing features:

1. `MASTER-PRD.md`
2. `docs/DEVELOPER-HANDOFF.md`
3. `docs/05-feature-specifications.md`
4. `architecture/database-schema.md`
5. `architecture/api-spec.md`
6. `docs/18-tech-stack-and-repo.md`
7. `docs/22-auth-pattern.md`
8. `backlog/INITIAL-BACKLOG.md`

When the code and docs conflict, raise a GitHub issue and resolve the source-of-truth document before silently changing product behavior.
