# Data Dictionary - Core Objects

## Tenant
Business-level container.
Required: id, name, status, timezone, currency, created_at.

## Outlet
Physical operating location.
Required: id, tenant_id, name, address, timezone, tax profile, status.

## User
Login identity.
Required: id, tenant_id, auth identity, status.

## StaffProfile
Operational employee information.
Required: user_id, outlet scope, role assignments, status.

## Product
Sellable menu item.
Required: id, outlet/tenant scope, category, name, current published state.

## ProductPrice
Versioned price record.
Required: product_id, effective_from, amount, tax mode, status.

## Recipe
Ingredient consumption definition.
Required: product_id, version, yield assumptions.

## Ingredient
Trackable raw material.
Required: unit, purchase unit, conversion, cost basis.

## InventoryLedger
Immutable stock movement.
Examples: purchase, sale consumption, waste, adjustment, transfer, return.

## Order
Canonical transaction intent and result.
Required: id, tenant_id, outlet_id, source, type, status, totals, operator/device context, created_at.

## OrderItem
Snapshot of product at sale time.
Required: product snapshot, quantity, unit price, tax/discount allocation.

## Payment
Payment attempt/record.
Required: order_id, method, status, amount, provider reference if any, idempotency key.

## Invoice
Commercial document linked to order.
Required: number, issue timestamp, tax/business snapshot, totals.

## Customer
Merchant-scoped customer profile.
Required: tenant/outlet scope, mobile identity, optional profile fields.

## LoyaltyLedger
Immutable earn/redeem/reversal history.
Required: customer, event type, delta, source reference, balance_after, timestamp.

## Promotion
Reusable discount/benefit rule.
Required: eligibility, calculation, stacking policy, validity.

## GameSession
One play instance.
Required: game_id, customer/device context, result, reward, timestamps.

## AuditLog
Security/business trace.
Required: actor, action, target, old/new values where appropriate, timestamp, request ID.
