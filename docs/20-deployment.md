# 20 — Deployment Shape

## Recommended initial deployment

- Next.js apps: Vercel or an equivalent Next.js-compatible platform.
- Express API: Node-compatible container/platform.
- Supabase: managed Supabase project.
- CI: GitHub Actions.

## Environment separation

At minimum:

- local
- staging
- production

Each environment must have a distinct Supabase project/credentials.

## Production requirements

- encrypted environment variables
- automated migrations
- backups
- error monitoring
- structured logs
- uptime monitoring
- webhook retry handling
- rate limits
- audit logs
- disaster recovery runbook
