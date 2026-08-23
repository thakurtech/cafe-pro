# Integration Engineering Rules

## Adapter pattern
Each provider is an adapter implementing a shared domain-facing interface.

Example interface concepts:
- receiveOrder
- updateOrderStatus
- syncMenu
- syncAvailability
- createPaymentIntent
- verifyWebhook
- fetchSettlement

Core services consume provider-neutral objects.

## Retry policy
- Exponential backoff.
- Dead-letter queue after repeated failures.
- Alert merchant/platform admin when action remains unresolved.

## Reconciliation
Every external money/order provider needs:
- provider order ID
- provider payment ID
- provider settlement ID where available
- timestamps
- gross value
- fees
- adjustments
- net value
- reconciliation status

Never assume external settlement equals internal order total.
