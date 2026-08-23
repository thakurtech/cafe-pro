# Feature Specifications

## POS
### Objective
Process restaurant transactions reliably, including when internet connectivity is unavailable.

### Functional requirements
- Create/edit/hold orders.
- Multiple order types.
- Modifiers and notes.
- Pricing and promotion evaluation.
- Table assignment.
- Customer attachment.
- Payment capture/recording.
- Invoice/receipt.
- KOT/KDS event.
- Refund/void according to permission.

### Acceptance criteria
- 100 consecutive local transactions can be created in an offline test scenario without data loss.
- Reconnect must not duplicate orders.
- Every financial adjustment has an operator and reason.

## Menu/catalog
- Categories.
- Products.
- Variants/modifiers.
- Price by outlet.
- Availability.
- Images.
- Recipe mapping.
- External channel mappings.

## Customer CRM
- Merchant-scoped customer profile.
- Mobile number primary identity.
- Guest order possible.
- Duplicate-phone resolution workflow.
- Purchase summary.
- Segmentation.

## Loyalty
- Rule engine.
- Ledger.
- Balance computation.
- Expiry.
- Redemption restrictions.
- Refund reversal.
- Merchant economics warning.

## Games
- Game registry.
- Configuration.
- Attempt policy.
- Reward policy.
- Session tracking.
- Fraud/rate limiting.
- Event logging.

## Campaigns
- Audience builder.
- Offer attachment.
- Schedule.
- Approval.
- Delivery adapter.
- Redemption attribution.

## Analytics
Required views:
- Sales by day/hour.
- Orders by channel.
- AOV.
- Repeat rate.
- Product sales.
- Gross margin estimate.
- Discount impact.
- Customer cohorts.
- Loyalty usage.
- Campaign performance.
- Aggregator reconciliation.

## Support/recovery
- Issue ticket linked to order/customer.
- Refund/replacement/coupon resolution.
- Internal notes.
- Resolution audit.
