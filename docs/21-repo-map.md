# 21 — Repository Map

## Applications

### `apps/merchant-web`
Merchant-facing product. Contains dashboard, POS, KOT/KDS, inventory, CRM, loyalty, marketing, reports and settings.

### `apps/customer-web`
Public/customer-facing storefront. Hostname resolution maps a cafe/restaurant domain or subdomain to a tenant/outlet.

### `apps/platform-admin`
Internal platform console for merchant lifecycle, subscriptions, integrations, support and system operations.

### `apps/api`
Express application API and domain application services.

### `apps/device-agent`
Local Node service for printer/cash-drawer/device bridges. Runs only where hardware integration is needed.

## Shared packages

- `ui`: visual primitives
- `types`: cross-app TypeScript contracts
- `validation`: input schemas
- `config`: environment configuration
- `db`: Supabase clients/types
- `auth`: auth helpers and role contracts
- `domain`: pure domain rules
- `api-client`: typed HTTP client
- `offline`: local persistence/sync primitives
- `events`: domain event contracts
- `hardware`: device descriptors/abstractions

## Database

`supabase/migrations` is the only source-controlled path for schema changes. Local database is managed by the Supabase CLI during development.
