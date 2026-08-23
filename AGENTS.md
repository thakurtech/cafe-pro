# Engineering Rules for Restaurant OS

## Product truth

Use `MASTER-PRD.md` and the documents in `docs/` as the product source of truth.

## Architecture truth

Use `architecture/` for technical decisions. Do not invent a new domain model when one already exists.

## Multi-tenancy

Every merchant-owned read/write must be scoped to a tenant. Outlet-level resources must additionally be scoped to an outlet where applicable.

## Security

Never use the Supabase service-role key in browser code. Prefer RLS for direct data access and the Express API for privileged workflows.

## Backend boundary

Express is the primary application API and business-logic boundary. Next.js is primarily the web application layer. Supabase provides managed Postgres/Auth/Storage/Realtime; it should not become a second untracked business-logic backend.

## Order integrity

Orders, payments, inventory and loyalty mutations must be idempotent and auditable.

## Offline POS

Any feature that changes the operational order lifecycle must document its behavior when the device is offline and after synchronization.

## Database

All schema changes require a migration in `supabase/migrations/`. Never edit production data manually as part of feature development.
