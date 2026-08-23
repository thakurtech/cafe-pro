# Business Rules

## Commercial
- Launch target is INR 499/month/outlet.
- Subscription is primary revenue stream.
- No mandatory hardware purchase.
- No mandatory payment gateway.
- Direct-order transaction fee target is zero initially.
- Premium messaging/integrations may be tiered.

## Customer
- Browsing does not require login.
- Ordering should support guest mode.
- Mobile number is the preferred merchant-scoped customer identity.
- OTP is not mandatory for ordinary ordering.
- Customer data does not automatically become a platform-wide consumer profile.

## Loyalty
- Merchant defines earn/redemption rules.
- Every points change is a ledger transaction.
- Refunds may reverse earned points according to configured rules.
- Expiry/transferability are merchant-controlled where supported.

## Promotions
- Promotion stacking must be explicit and deterministic.
- Every applied promotion is stored against the order.
- Merchant must be able to disable a promotion without deleting historical records.

## Games
- Game rewards are funded/approved by merchant configuration.
- Games must have rate limits and anti-abuse controls.
- Game currency is separate from loyalty value.

## Pricing
- Product prices are outlet-scoped and versioned.
- Historical orders retain historical price snapshots.

## Permissions
- Financially sensitive actions require granular permission.
- All refunds, price overrides, deletions/voids and sensitive configuration changes are audited.

## Data
- Tenant isolation is mandatory.
- Merchant export is required.
- Deletion/retention behavior must comply with contractual/legal requirements.
