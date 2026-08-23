# QA and Test Plan

## Test layers
1. Unit tests - domain rules and calculations.
2. Integration tests - database, queue, payment adapters, printers where feasible.
3. Contract tests - API and integration adapters.
4. End-to-end tests - critical customer and merchant journeys.
5. Offline tests - POS and synchronization.
6. Security tests - authorization and tenant isolation.
7. Load tests - order ingestion and peak-hour flows.

## P0 regression journeys
- merchant onboarding
- menu creation
- POS sale
- split payment
- discount
- invoice
- KOT
- KDS complete
- inventory consumption
- customer guest checkout
- customer identification
- loyalty earn
- loyalty redeem
- refund and loyalty reversal
- offline order
- reconnect sync
- printer failure/retry
- subscription activation

## Tenant isolation tests
- merchant A cannot access merchant B data.
- outlet user cannot access unauthorized outlet.
- public storefront cannot read private merchant fields.
- support impersonation is audited.

## Money correctness
- order total is deterministic.
- discount calculations are reproducible.
- taxes use stored configuration/version.
- split payments sum to order amount within configured rounding policy.
- refunds never exceed eligible captured amount.
- duplicate payment webhook is idempotent.

## Loyalty correctness
- no duplicate reward event on retried order event.
- refund reverses configured earned points.
- redemption cannot produce negative balance unless explicitly supported.
- expired reward cannot redeem.

## Offline correctness
Run tests for:
- one device offline
- two devices offline
- crash before sync
- crash after server accepts but before local ack
- duplicate sync attempt
- long outage
- clock skew
- printer unavailable

## Performance targets
Exact SLOs should be set after stack selection. Target low-latency interaction for POS actions and mobile storefront browsing under typical Indian cafe connectivity.

## Release gates
No production release if:
- critical payment defects exist.
- duplicate order creation exists.
- tenant isolation test fails.
- offline transaction loss exists.
- critical printer workflow fails.
