# 22 — Authentication Pattern

Supabase Auth is the identity provider.

## Next.js

Next.js SSR should use `@supabase/ssr` with cookie-based sessions and Proxy token refresh. Keep browser and server clients distinct.

## Express

The API receives the caller's bearer access token and validates/derives identity before executing tenant-scoped application services.

## Service role

The Supabase service-role credential is server-only and must never be exposed to any browser bundle.

## Customer guest flow

Guest ordering must not require an authenticated Supabase user. Guest identity is represented by a merchant-scoped customer record after phone capture/consent rules are satisfied.

## Merchant staff flow

Merchant staff are authenticated users mapped to `tenant_members`, with role + outlet authorization enforced in application code and reinforced with RLS for direct data access.
