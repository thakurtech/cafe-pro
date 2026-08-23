# Integrations

## Integration architecture
All third-party systems must use adapter interfaces. Core domain objects must not depend directly on provider-specific code.

## Target classes
- Payment providers
- Swiggy
- Zomato
- WhatsApp/SMS
- Email
- Accounting systems
- Thermal printers
- Kitchen displays
- Existing POS migration/import sources

## Adapter contract example
Each external adapter should define:
- authentication
- webhook/event handling
- retry policy
- rate limits
- mapping
- error classification
- health status
- reconciliation support

## Swiggy/Zomato
Target capabilities:
1. Receive orders.
2. Map to canonical order model.
3. Push order status where supported.
4. Menu synchronization where supported.
5. Availability synchronization where supported.
6. Reconciliation.

Official API/partner availability must be validated during implementation. Do not rely on unofficial automation.

## Payment provider abstraction
Support merchant-selected provider where technically available. Keep payment intent, payment transaction and settlement objects provider-neutral.

## Messaging
Provider abstraction for WhatsApp/SMS/email/push. Campaign engine should not know the vendor implementation.
