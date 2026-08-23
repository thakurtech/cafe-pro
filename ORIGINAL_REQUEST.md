# Original User Request

## Initial Request — 2026-08-23T21:52:37Z

Build the full, ship-grade production-ready Restaurant Operating System and Customer Growth SaaS platform in `c:\Users\sumit\OneDrive\Desktop\cofeeos` (Next.js 16 + NestJS) and `c:\Users\sumit\OneDrive\Desktop\CafeOs\Cafeos` based on `PRD-overview/MASTER-PRD.md`.

Working directory: `c:\Users\sumit\OneDrive\Desktop\cofeeos`

Integrity mode: development

## Requirements

### R1. Full-Stack Multi-Tenant SaaS Platform (`cofeeos`)
Provide a complete Next.js 16 frontend + NestJS backend platform supporting Super-Admin multi-tenant management, Cafe Owner Portal, POS Terminal, Kitchen Display System (KDS), Customer Web Ordering & Table QR Checkout, Loyalty Rewards, and Affiliate Management.

### R2. High-Performance POS & Kitchen Workflows
Ensure the POS (`/pos`) and Kitchen Display (`/kitchen`) support real-time order creation, item modifiers, custom notes, split payments (Cash, UPI QR, Card), KOT print simulation, and prep time tracking.

### R3. Branded Customer Web Storefront & Loyalty Engine
Support guest-first browsing without forced authentication, table QR ordering, mobile-keyed customer loyalty points calculation, spend analytics, and automated rewards redemption.

### R4. Complete Build & Type Safety Verification
Ensure all TypeScript type checks (`npm run lint` / `npx tsc --noEmit`) and production builds (`npm run build`) pass cleanly with 0 errors across both `cofeeos/frontend` and `Cafeos`.

### R5. Complete Developer Handover & Production Documentation
Provide comprehensive documentation (`currentstate.md` and `USER_GUIDE.md`) detailing setup, API routes, database schemas, and maintainer workflows.

## Acceptance Criteria

### Build & Compilation
- [ ] `cofeeos/frontend` builds cleanly with Next.js Turbopack (`npm run build` succeeds).
- [ ] `Cafeos` builds cleanly with Vite (`npx vite build` succeeds).

### Functional Verification
- [ ] Live preview servers run on `http://localhost:8080` (Next.js) and `http://localhost:3000` (Vite).
- [ ] POS -> Kitchen KDS -> Loyalty -> Super-Admin workflows function end-to-end without runtime exceptions.
- [ ] All developer handover documentation is up-to-date and accurate.
