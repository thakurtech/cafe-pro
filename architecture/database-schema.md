# Database / Domain Model

## Core entities
Tenant, Brand, Outlet, User, Role, Permission, StaffProfile, Device, Menu, Category, Product, ProductPrice, ModifierGroup, Modifier, Recipe, RecipeItem, Ingredient, Supplier, PurchaseOrder, PurchaseReceipt, InventoryLedger, InventoryBalance, Table, Order, OrderItem, Payment, Refund, Invoice, KitchenTicket, Customer, CustomerIdentity, LoyaltyAccount, LoyaltyLedger, Reward, Coupon, Promotion, Referral, Game, GameSession, GameReward, Membership, GiftCard, Campaign, CampaignAudience, CampaignEvent, Notification, Review, Subscription, IntegrationConnection, IntegrationEvent, AuditLog.

## Key relationships
Tenant 1:N Outlet.
Tenant 1:N User.
Outlet 1:N Device.
Outlet 1:N Table.
Outlet 1:N Order.
Order 1:N OrderItem.
Order 1:N Payment.
Order 0:N Invoice.
Product N:N Modifier.
Product 0:1 Recipe.
Recipe 1:N RecipeItem.
Ingredient 1:N InventoryLedger.
Customer 1:1 LoyaltyAccount per outlet/brand scope as designed.
Customer 1:N Order.
Customer 1:N LoyaltyLedger.
Campaign 1:N CampaignEvent.
Game 1:N GameSession.

## Critical implementation rules
- Use immutable transaction/ledger records for money, loyalty and inventory movements.
- Snapshot product name/price/tax configuration into order items so historical orders do not change when the catalog changes.
- Use idempotency keys for payments and order writes.
- Store source/provider references for external orders.
- Store timestamps in UTC with outlet timezone for rendering/reporting.
- Soft-delete configuration records where historical references must remain intact.
