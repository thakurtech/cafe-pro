# Sequence Examples

## Online POS order
1. Cashier creates order locally and sends create request.
2. API validates tenant/outlet/permissions.
3. Order service persists order and emits OrderCreated/OrderPlaced.
4. Payment service records payment.
5. KOT service creates kitchen ticket.
6. Inventory service reserves/consumes configured stock.
7. Loyalty service creates earn entry after qualifying completion.
8. Analytics consumes order event asynchronously.

## Customer web order
1. Customer opens tenant/outlet storefront.
2. Catalog API returns published menu.
3. Customer creates cart client-side.
4. Checkout validates price/availability/promotions server-side.
5. Payment is initiated or merchant payment instructions are shown.
6. Order is created with idempotency key.
7. Kitchen workflow begins.
8. Customer receives order status updates.

## Offline order
1. POS client detects offline state.
2. Transaction is committed to local durable store.
3. Local order ID is generated.
4. Local KOT/receipt output is attempted.
5. Transaction is appended to sync queue.
6. Connection returns.
7. Sync worker uploads transaction/event with idempotency key.
8. Server returns authoritative record.
9. Local store marks transaction synchronized.

## Refund
1. Authorized operator selects order.
2. Server checks refund eligibility.
3. Refund record created.
4. External payment refund requested if applicable.
5. Inventory/loyalty/promotion adjustments produced according to rules.
6. Audit event recorded.
7. Customer notification queued.
