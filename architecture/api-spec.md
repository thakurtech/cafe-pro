# API Requirements

The API should be versioned and contract-driven.

## Representative resources
GET/POST /v1/outlets
GET/POST /v1/menu/products
GET/POST /v1/orders
GET/PATCH /v1/orders/{id}
POST /v1/orders/{id}/payments
POST /v1/orders/{id}/refunds
GET/POST /v1/customers
GET /v1/customers/{id}
POST /v1/loyalty/earn
POST /v1/loyalty/redeem
GET/POST /v1/promotions
GET/POST /v1/campaigns
POST /v1/games/{id}/sessions
GET/POST /v1/tables
GET/POST /v1/inventory
GET/POST /v1/purchases
GET /v1/analytics/*
GET/POST /v1/integrations/*

## Requirements
- Authentication required except public storefront endpoints.
- Tenant and outlet context enforced server-side.
- Idempotency for mutation endpoints that can be retried.
- Structured error responses.
- Pagination and filtering.
- Request tracing ID.
- Rate limits.
- Backward-compatible versioning policy.
- Webhook signature verification for external providers.

## Public storefront
Public catalog and storefront APIs must expose only published data and never trust client-provided tenant/outlet authorization.
