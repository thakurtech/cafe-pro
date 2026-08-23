# 19 — Local Development

## Prerequisites

- Node.js 22+
- pnpm 10+
- Docker Desktop
- Supabase CLI

Supabase libraries no longer support Node 20 from June 30, 2026, so the repo standard is Node 22+. The project should periodically re-check supported runtime versions before production releases.

## First setup

```bash
pnpm install
cp .env.example .env
supabase start
pnpm db:reset
pnpm db:types
pnpm dev
```

## Services

- Merchant web: `3000`
- Customer web: `3001`
- Platform admin: `3002`
- Express API: `4000`
- Supabase local API: `54321`
- Supabase database: `54322`
- Supabase Studio: `54323`

## Local development principles

- Use seed data only for deterministic test/demo tenants.
- Never copy real production merchant/customer data into local development.
- Keep all secrets in `.env` or an approved secret manager.
- Use the local Supabase stack for schema changes and RLS testing.
