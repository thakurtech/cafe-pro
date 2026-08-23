# System Architecture

## High-level

Client applications:
- Merchant web/POS
- Customer web/PWA
- Platform admin
- Optional local device/print agent

Backend domains:
- Identity/Auth
- Tenant
- Catalog
- Orders
- Payments
- Billing
- Kitchen
- Inventory
- Customers/CRM
- Loyalty
- Promotions
- Games
- Campaigns
- Analytics
- Integrations
- Notifications
- Subscriptions
- Support

Infrastructure concepts:
- Relational transactional database
- Cache
- Job queue/event bus
- Object storage
- Analytics warehouse/read model
- Observability stack

## Principle
Keep the core domain modular. Third-party integration code stays behind adapters. Cross-module communication should prefer domain events over deep synchronous coupling.

## Data separation
Tenant ID is mandatory on tenant-owned entities. Outlet ID is mandatory on outlet-scoped operational entities.

## Recommended logical tiers
1. Presentation.
2. Application/use-case layer.
3. Domain layer.
4. Persistence/integration layer.
5. Async event processing.

The exact programming stack remains open and should be chosen by the engineering lead after evaluating offline requirements, hardware access and team competence.
