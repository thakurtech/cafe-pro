# Project State & Progress Summary
**Last Updated:** August 23, 2026

## 1. Project Overview
**Restaurant OS (Cafe Pro)** is a multi-tenant SaaS operating system for independent Indian cafes and restaurants. It combines POS, QR ordering, CRM, loyalty, and analytics into a single platform.

**Core Architectural Rule:** The **Order** is the central business object. All channels (POS, QR, aggregators) flow into one canonical order lifecycle.

## 2. Tech Stack
- **Frontend:** Next.js 16 App Router
- **Backend:** Express 5 + Node.js (API)
- **Database/Auth:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS v4
- **Language:** TypeScript
- **Monorepo:** pnpm workspaces + Turborepo

## 3. Monorepo Structure
- `apps/merchant-web`: Cafe Owner panel (Dashboard, Menu Catalog, Staff management, Loyalty CRM, Integrations, settings)
- `apps/customer-web`: Customer Storefront (QR Ordering, Menu, Checkout)
- `apps/platform-admin`: Internal SaaS administration console (Tenants, Outlets, plan configs, users/roles, integrations, system health, audit logs)
- `apps/api`: Express backend server
- `packages/types`: Shared TypeScript definitions
- `supabase/migrations`: Source of truth for database schema

## 4. Completed Sprint Goals
*   **Tailwind CSS v4 & PostCSS setup**: Integrated modern Tailwind CSS v4 styling across both admin workspaces.
*   **Production-Ready Auth Middleware**: Added page route checks in Next.js middleware using the Supabase server client.
*   **Platform Super Admin portal**: Complete workspace containing Tenant registry, Outlets grouping, Subscriptions configs, Users roles, Integrations, System stats, and Audit log tracking.
*   **Merchant Admin dashboard**: Completed operational dashboard executing dynamic queries on `orders` and `customers` databases for real-time sales calculations, along with a full catalog editor, staff list, loyalty editor, settings, and integrations panel.
