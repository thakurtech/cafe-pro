# Contributing

## Rules

1. Every material product change must reference a PRD section or approved issue.
2. Never bypass tenant/outlet authorization in application code.
3. Never expose the Supabase service-role key to browser code.
4. Any order/payment/inventory mutation must be designed for idempotency.
5. Any POS flow must define offline behavior explicitly.
6. Database changes require versioned migrations.
7. RLS policies are mandatory for tenant-owned data.
8. Do not commit real secrets, merchant data, payment credentials or production exports.

## Branches

- `main`: production-ready
- `develop`: optional integration branch if the team chooses to use one
- `feat/*`: feature work
- `fix/*`: bug fixes
- `chore/*`: maintenance

## Commit style

Prefer conventional commits:

- `feat:`
- `fix:`
- `refactor:`
- `test:`
- `docs:`
- `chore:`
