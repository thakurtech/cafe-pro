# Event Model

## Domain events
- TenantCreated
- OutletCreated
- ProductCreated
- ProductPriceChanged
- OrderCreated
- OrderPlaced
- OrderAccepted
- OrderPreparing
- OrderReady
- OrderCompleted
- OrderCancelled
- PaymentRecorded
- PaymentFailed
- RefundCreated
- InvoiceIssued
- KOTCreated
- KitchenTicketCompleted
- InventoryAdjusted
- StockConsumed
- CustomerCreated
- CustomerIdentified
- LoyaltyEarned
- LoyaltyRedeemed
- LoyaltyReversed
- CouponApplied
- ReferralAttributed
- GamePlayed
- GameRewardGranted
- CampaignScheduled
- CampaignDelivered
- CampaignRedeemed
- SubscriptionActivated
- SubscriptionPastDue

## Event rules
- Events have globally unique IDs.
- Events are immutable.
- Consumers must be idempotent.
- Event version is explicit.
- Sensitive events must be auditable.

## Example
OrderCompleted emits:
- RevenueRecognized
- InventoryConsumptionRequested
- LoyaltyEarnRequested
- CustomerOrderUpdated
- AnalyticsOrderUpdated
- CampaignEligibilityUpdated

The event bus is an internal contract; asynchronous side effects should not block order completion unless operationally required.
