# Project State & Progress Summary
**Last Updated:** August 23, 2026

## 1. Project Overview
**Restaurant OS (Cafe Pro)** is a multi-tenant SaaS operating system for independent Indian cafes and restaurants. It aims to replace legacy POS systems by combining POS, QR ordering, CRM, loyalty, and analytics into a single platform.

**Core Architectural Rule:** The **Order** is the central business object. All channels (POS, QR, aggregators) flow into one canonical order lifecycle.

## 2. Tech Stack
- **Frontend:** Next.js 16 App Router
- **Backend:** Express 5 + Node.js (API)
- **Database/Auth:** Supabase (PostgreSQL)
- **Language:** TypeScript
- **Monorepo:** pnpm workspaces + Turborepo

## 3. Monorepo Structure
- `apps/merchant-web`: Cafe Owner panel (POS, Dashboard, KDS)
- `apps/customer-web`: Customer Storefront (QR Ordering, Menu, Checkout)
- `apps/platform-admin`: Internal SaaS administration
- `apps/api`: Express backend server
- `packages/types`: Shared TypeScript definitions
- `supabase/migrations`: Source of truth for database schema

## 4. Current Progress & Sprint Goal (Today)
The immediate goal is to build the **End-to-End Core Ordering Flow MVP** today. 

### Work Split
To maximize velocity and avoid merge conflicts, the team is splitting the work while sharing a strict data contract:
*   **Developer 1 (User)**: Building `apps/customer-web`. Focuses on the customer browsing the menu, adding items to the cart, and placing an order.
*   **Developer 2 (Mukul)**: Building `apps/merchant-web`. Focuses on the merchant dashboard receiving the order in real-time, viewing it, and completing it.

### Core Schema Agreement
To enable independent "vibe coding" (AI-assisted rapid prototyping), both developers have agreed to a strict shared contract for `Order` and `Product` entities. 
*   **TypeScript Types:** These are locked in at `packages/types/src/index.ts`. Both developers MUST import and use these interfaces for their mock data and state.
*   **SQL Database:** The Supabase schema is already finalized and matches these types (located in `supabase/migrations/20260823000000_foundation.sql`).

## 5. Instructions for AI Assistants
If you are an AI assistant helping a developer on this project:
1. **Respect the Split**: If helping with `customer-web`, do not modify `merchant-web`, and vice versa.
2. **Use Shared Types**: Always import `Product`, `Order`, `OrderItem`, etc., from `@repo/types`. Do not invent new interfaces for these core entities.
3. **Mock First**: Since the Express API might not be fully wired up yet, build the UI components using hardcoded mock data that conforms strictly to the shared TypeScript types.
4. **No Schema Changes**: Do not recommend modifying the Supabase SQL schema or the core Typescript interfaces without explicit team consensus. It will break the other developer's app.
