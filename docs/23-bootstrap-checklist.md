# 23 — Developer Bootstrap Checklist

## Repository

- [ ] Clone private repository
- [ ] Install Node 22+
- [ ] Enable pnpm 10+
- [ ] Install Docker
- [ ] Install Supabase CLI
- [ ] Run `pnpm install`
- [ ] Copy `.env.example` to `.env`

## Supabase

- [ ] Create local project with `supabase start`
- [ ] Apply migrations with `pnpm db:reset`
- [ ] Generate TypeScript DB types with `pnpm db:types`
- [ ] Verify RLS policies using authenticated and guest test cases

## Applications

- [ ] Run merchant web on 3000
- [ ] Run customer web on 3001
- [ ] Run platform admin on 3002
- [ ] Run Express API on 4000
- [ ] Run device agent only on machines with local hardware

## First implementation milestone

Before building the full dashboard, complete:

1. tenant creation
2. outlet creation
3. merchant authentication
4. role membership
5. menu CRUD
6. product CRUD
7. order state machine
8. basic POS order creation
9. payment recording
10. basic customer record creation
11. offline operation contract
12. audit event for every order/payment mutation

## Do not proceed to advanced loyalty/games/campaigns until the order + payment + inventory foundations are reliable.
