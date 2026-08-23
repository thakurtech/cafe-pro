# 18 — Technology Stack & Repository Architecture

## Approved stack

### Web
- Next.js 16 App Router
- React 19
- TypeScript

### Backend
- Node.js 22+
- Express 5
- TypeScript

### Data / platform
- Supabase Postgres
- Supabase Auth
- Supabase Storage
- Supabase Realtime where justified

### Repository
- pnpm workspaces
- Turborepo

## Boundary rules

### Next.js
Owns:
- routing
- server/client rendering
- merchant UI
- POS UI
- customer storefront UI
- platform admin UI
- browser-side local/offline state

### Express
Owns:
- business use cases
- authorization enforcement for privileged operations
- payment orchestration
- aggregator integrations
- webhook processing
- idempotency
- transactional workflows
- domain events

### Supabase
Owns:
- Postgres persistence
- authentication
- file storage
- realtime primitives
- row-level security

Do not duplicate business logic across Next.js server actions, Express and database triggers unless there is a documented reason.

## Dependency rule

Prefer dependencies from the nearest shared package rather than duplicating versions across apps.
