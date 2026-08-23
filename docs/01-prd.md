# Master Product Requirements Document

Version: 0.1
Status: Developer handoff draft
Audience: Product, engineering, design, QA, operations

## 1. Product definition
Restaurant OS is a multi-tenant SaaS platform for restaurants. Initial GTM is independent Indian cafes and restaurants with roughly 30-50 orders/day, but the domain model must support larger merchants and multiple outlets.

Each paid outlet receives an operating environment containing POS and operational modules plus a customer-facing branded web storefront and QR ordering experience.

Example:
`mukulscafe.ourbrand.com`

The system must be capable of eventually replacing legacy POS software rather than merely sitting beside it.

## 2. Primary users
### 2.1 Owner
Needs financial visibility, configuration, high-level performance, permissions, customer growth and exception handling.

### 2.2 Manager
Runs daily operations, staff, inventory, orders, campaigns and reports.

### 2.3 Cashier
Creates and settles orders, handles payments and receipts, with restricted access to sensitive settings.

### 2.4 Kitchen staff
Receives KOT/KDS work and changes preparation state.

### 2.5 Captain/front-of-house
Creates/updates table orders, sees service state and customer requests where applicable.

### 2.6 Accountant
Read/report access to invoices, tax records, settlements and exports.

### 2.7 Customer
Browses, orders, pays, earns/redeems rewards, plays optional games and receives offers.

### 2.8 Platform admin
Manages tenants, subscriptions, support, feature flags, integration health, fraud and system operations.

## 3. Tenant model
Top-level tenant = merchant brand/business.
Each tenant contains one or more outlets.
Subscription billing is per outlet.

Tenant data must never cross tenant boundaries. Outlet-level operational data is isolated while brand-level rollups are available to authorized brand users.

## 4. Pricing requirements
Launch target: INR 499/month/outlet.
Expected future tiers:
- Starter: 499
- Growth: approximately 999
- Pro: approximately 1,999
These numbers are commercial targets, not hardcoded product constants.

Subscription-first. Hardware, payment processing, WhatsApp/SMS and premium integrations may be optional revenue streams.

## 5. Core modules
### P0
- Merchant onboarding
- Multi-tenancy
- Menu/catalog
- POS
- Order lifecycle
- Billing/invoicing
- Payments recording and configurable gateway support
- Offline operation for critical POS workflows
- KOT
- Basic KDS
- Tables/floor basics
- Inventory basics
- Recipe basics
- Staff and permissions
- Thermal printer support architecture
- Customer web storefront
- QR ordering
- Guest checkout
- Customer profiles keyed primarily by mobile number
- Loyalty engine and ledger
- Coupons/promotions
- Merchant dashboard
- Subscription billing
- Audit log

### P1
- Swiggy/Zomato integrations subject to official API/partner capability
- Deep inventory
- Procurement
- Supplier management
- Reconciliation
- Referral engine
- Memberships
- Gift cards
- Gamification engine
- Campaign automation
- Advanced analytics
- Reviews/feedback
- Multi-outlet operations
- Advanced KDS
- Accounting exports

### P2
- Predictive churn
- Demand forecasting
- Dynamic merchandising
- AI assistant
- Franchise controls
- Hardware marketplace
- Consumer discovery/network

## 6. Merchant onboarding
Target: a cafe can reach a testable live state within one onboarding session.

Flow:
1. Create account.
2. Choose plan.
3. Create tenant/outlet.
4. Enter business details.
5. Configure taxes and invoice information.
6. Configure payment methods.
7. Import or create menu.
8. Configure tables and kitchen stations.
9. Connect printers/devices.
10. Run test order.
11. Print test KOT and receipt.
12. Publish customer site and QR codes.
13. Go live.

Migration should support a parallel period where the merchant can validate Restaurant OS against their old workflow before cutover.

## 7. Merchant website
Each outlet gets a branded storefront. Default model is structured templates with approximately 80% structured configuration and 20% customization.

Required capabilities:
- branding
- menu/category display
- search
- product details
- modifier selection
- recommendations
- cart
- checkout
- payment
- order status
- offers
- rewards visibility
- games entry point
- referrals
- reorder
- gift cards/membership where enabled

Custom domains are a future capability but the routing architecture must support them.

## 8. Customer ordering
Guest-first:
1. Scan/open cafe site.
2. Browse without login.
3. Add items.
4. See cross-sells and bundles.
5. Checkout.
6. Choose available payment method.
7. Optionally provide mobile number for customer identity/rewards.
8. Receive order confirmation.

Mobile number is the primary customer identifier within a merchant relationship. OTP should not be mandatory for ordinary ordering because messaging costs should be minimized.

## 9. Order engine
All order sources use one canonical order model:
- POS
- QR
- website
- aggregator integrations
- future phone/manual sources

Canonical status flow:
DRAFT -> PLACED -> ACCEPTED -> PREPARING -> READY -> SERVED/PICKED_UP -> COMPLETED

Exceptional states:
CANCELLED, FAILED, REFUNDED, PARTIALLY_REFUNDED.

Every state transition is auditable and event-driven.

## 10. POS requirements
Support:
- dine-in
- takeaway
- delivery
- table order
- counter order
- modifiers
- add-ons
- combos
- split bill
- merge bill
- hold/resume
- price override permissions
- discounts
- taxes/service charges/tips where configured
- refunds and partial refunds
- receipt reprint
- duplicate receipt rules
- customer assignment
- payment methods
- cash drawer/opening/closing cash
- end-of-day settlement
- order notes

## 11. Offline requirements
Critical POS workflows must remain operational during internet loss.

At minimum while offline:
- create order
- modify order
- send KOT/KDS work where local network topology permits
- print supported receipts/KOT
- record cash/card/UPI status according to configured mode
- close order
- queue synchronization

Every local transaction must carry a globally unique identifier and deterministic idempotency key.

On reconnection:
- upload pending events
- reconcile inventory
- reconcile payment state
- avoid duplicate orders
- record conflicts
- preserve original timestamps and operator/device context

## 12. Kitchen
Capabilities:
- KOT print
- KDS screen
- station routing
- item readiness
- prep timer
- priority
- sold-out/unavailable items
- delayed order indicators
- completion state

## 13. Tables
Capabilities:
- floor plan
- table status
- table QR
- occupied/available/reserved/cleaning
- move order
- merge tables
- split bill by guest/item
- multiple orders per table

## 14. Inventory
Core:
- ingredients
- units and conversions
- stock on hand
- stock adjustments
- wastage
- damage
- transfers
- reorder thresholds
- stock counts

Recipe consumption:
Product sale decrements component ingredients using configured recipes.

## 15. Procurement
P1:
- suppliers
- purchase orders
- goods received
- purchase invoices
- supplier pricing history
- purchase returns
- accounts payable export

## 16. Billing and finance
Capabilities:
- invoice generation
- invoice numbering
- business details
- tax configuration
- credit/debit notes where required
- payment status
- refunds
- settlement records
- sales summaries
- payment channel summaries
- aggregator reconciliation

Exact GST compliance rules must be validated during implementation against current Indian requirements and qualified accounting advice.

## 17. Customer CRM
Customer profile may contain:
- mobile number
- name
- optional email
- visit count
- order count
- total spend
- average order value
- last visit
- favorite categories/products
- loyalty balance
- coupons
- membership
- referrals
- feedback
- consent/preferences

Segments:
- new
- active
- loyal
- VIP
- at-risk
- dormant
- high-value
- category preference
- frequency bands

## 18. Loyalty engine
Merchant configurable rules:
- spend-based points
- first order
- repeat visits
- referral
- birthday
- time/day multipliers
- product-specific rewards

Merchant controls:
- earn rate
- redemption value
- expiry
- transferability
- redemption restrictions

System must warn about unusually generous economics and show estimated effective discount where possible.

All points changes are ledger entries, never silent balance mutations.

## 19. Promotion engine
Unified engine for:
- percentage discounts
- fixed discounts
- minimum order value
- item offers
- bundles
- BOGO
- time-based offers
- customer segment offers
- membership offers
- loyalty bonuses
- game rewards

Rules must be deterministic, auditable and precedence-controlled to prevent stacking bugs.

## 20. Recommendations
Phase 1:
- merchant-defined associations
- bundles

Phase 2:
- co-purchase analytics
- customer preference recommendations

Recommendations should be explainable enough for merchant operators to understand why an item is being promoted.

## 21. Gamification
Build a generic game engine rather than hard-code one game.

Game configuration:
- game type
- attempts/day
- cooldown
- eligibility
- skill/chance model
- reward type
- win configuration
- minimum order requirements
- expiry
- merchant budget

Separate game currency from monetary loyalty points. Game coins may be used for participation/engagement; loyalty points represent merchant-funded value.

Potential games:
- scratch card
- spin
- memory
- timing
- quiz
- cafe rush
- lucky table
- daily challenge

Games must include fraud/rate-limit protections and merchant spending controls.

## 22. Referral engine
Flow:
Customer receives referral link/code -> friend lands on cafe site -> friend orders -> attribution recorded -> reward triggered according to merchant rule.

Need:
- unique referral identifiers
- attribution window
- fraud prevention
- reward ledger entry
- reporting

## 23. Memberships
Future/P1:
- recurring membership
- benefits
- included items/credits
- discounts
- points multipliers
- renewal/expiry

## 24. Gift cards
Future/P1:
- issue
- send/share
- redeem
- partial redemption
- expiry
- balance
- refund rules

## 25. Campaign engine
Manual and automated campaigns.

Manual:
- segment
- offer
- channel
- schedule
- cap

Automated triggers:
- first order
- second-order incentive
- inactivity
- birthday
- high value
- frequent buyer
- product-specific event
- new product
- inventory event

Messaging should be provider-agnostic. Paid messaging channels should be configurable by plan.

## 26. Merchant dashboard
Home must answer:
1. How much did I sell?
2. How did I perform vs baseline?
3. What is going wrong?
4. Where am I missing revenue?
5. What should I do next?

Suggested top-level cards:
- today's sales
- orders
- average order value
- repeat rate
- direct order share
- gross margin estimate
- alerts
- revenue opportunities

## 27. Revenue opportunities
System should surface deterministic opportunities such as:
- high-value inactive customers
- under-selling profitable products
- low-margin popular products
- high stock/wastage risk
- unused direct ordering channel
- bundle opportunities

Do not require generative AI.

## 28. Staff
P0:
- users
- roles
- permissions
- shift/login audit
- cashier reconciliation
- device association
- restricted actions

P1:
- attendance
- scheduling
- leave
- incentives
- performance

## 29. Hardware
Bring-your-own is default. Support a hardware abstraction layer.

Initial target classes:
- thermal printer
- kitchen printer
- cash drawer
- barcode scanner
- Windows terminal
- Android tablet

Hardware purchasing is optional future revenue.

## 30. Aggregator integrations
Architect around adapters so core order/domain logic does not know vendor-specific details.

Target integrations: Swiggy and Zomato.

Potential capabilities:
- order ingestion
- status updates
- menu sync
- availability
- price sync
- reporting
- reconciliation

Actual availability depends on official APIs/partnerships and must be verified during integration work. Do not design the core product around unofficial access.

## 31. Accounting integrations
P1:
- exports
- Tally/Zoho-compatible workflows where technically appropriate
- invoice data
- purchase data
- settlement data

## 32. Security
Required:
- tenant isolation
- role-based access control
- secure authentication
- MFA for owners as an option/strong recommendation
- audit logs
- encryption in transit/at rest as appropriate
- backups
- disaster recovery
- sensitive-action reauthentication
- rate limiting
- fraud controls

## 33. Data ownership
Merchant-specific customer relationship data is treated as merchant-owned business data. Product terms must define access, export, retention and deletion rights.

Merchant export should cover at least:
- customers
- orders
- products
- loyalty ledger
- invoices/reports

## 34. Admin platform
Platform admin capabilities:
- merchant management
- subscription management
- plan configuration
- support tooling
- safe support impersonation with audit
- feature flags
- integration health
- billing support
- fraud review
- system health

## 35. Success criteria
Launch is successful when a representative 30-50 order/day merchant can operate core daily transactions without depending on a legacy POS, and can publish a customer ordering channel with loyalty/CRM.

Product-market validation should measure:
- activation rate
- time to first order
- time to go live
- merchant retention
- weekly active merchants
- direct order volume
- repeat purchase rate
- average order value
- support tickets/merchant
- critical operational failure rate

## 36. Non-goals for V1
- universal consumer marketplace
- mandatory AI
- full enterprise accounting suite
- proprietary payment rail
- mandatory hardware bundle
- complex reservation marketplace
- franchise ERP
- social network

