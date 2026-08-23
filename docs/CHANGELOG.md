# Changelog

All notable changes to the Restaurant OS (Cafe Pro) project will be documented in this file.

## [0.2.0] - 2026-08-23

### Added
- **Tailwind CSS v4 Configuration**: Installed `tailwindcss`, `@tailwindcss/postcss`, and `postcss` in both `apps/platform-admin` and `apps/merchant-web` workspaces. Integrated them with PostCSS configurations and imported `@import "tailwindcss";` in global CSS.
- **Supabase Auth Middleware Route Protection**: Implemented custom Next.js middleware (`src/middleware.ts`) in both apps to refresh cookie-based Supabase sessions and redirect non-authenticated users to `/login`.
- **Platform Super Admin Portal (`apps/platform-admin`)**:
  - Main Sidebar navigation frame with live sandbox status and role checks ensuring only users with database role `PLATFORM_ADMIN` can access console features.
  - Interactive Tenant/Cafe brand registrations, list filters, and active subscription toggles.
  - Locations & Outlets group management.
  - Subscriptions & plan codes editor.
  - Users Directory & Roles promotion console (`PLATFORM_ADMIN`, `OWNER`, `MANAGER`, etc.).
  - Third-party integrations health monitor dashboard.
  - Node system performance metrics dashboard (CPU, memory, database query pools, table sizes).
  - Chronological audit actions logs viewer.
- **Merchant Admin Portal (`apps/merchant-web`)**:
  - Main Sidebar navigation layout linked with tenant and member validation (displays active brand name and member role dynamically).
  - Home Dashboard featuring live database calculations for total sales, orders processed, Average Order Value (AOV), and repeat customer rates.
  - Menu & Catalog Editor to configure categories, add menu products with pricing, and toggle sold-out statuses.
  - Staff invite/permission console linked with user profiles.
  - Outlet business profile configuration and subscription plans limits inspector.
  - Communications/notifications and gateway integrations controller.
  - Customer relationship ledger and loyalty points rules manager.

### Changed
- Replaced simple route placeholders in Platform Admin and Merchant Web with fully styled, stateful dashboards.
