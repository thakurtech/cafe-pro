# Offline Architecture Requirements

## Objective
A cafe must continue core operations during internet outages.

## Requirements
- Local persistent storage on POS client.
- Local transaction queue.
- Unique transaction IDs generated offline.
- Idempotent server writes.
- Sync status per record.
- Retry with backoff.
- Conflict detection.
- Operator-visible sync health.
- Local printer access.

## Sync model
Prefer event or change-log based synchronization for transactional entities.

Example:
LOCAL ORDER_CREATED -> LOCAL PAYMENT_RECORDED -> LOCAL ORDER_COMPLETED

When online:
UPLOAD events -> SERVER ACK -> MATERIALIZE authoritative server state -> mark local events synced.

## Conflict rules
- Completed financial transactions are append-only after close except controlled reversal/refund events.
- Configuration changes use version checks.
- Inventory uses transaction ledger rather than mutable absolute quantities alone.
- Customer profile merges require explicit conflict handling.

## Failure cases to test
- Offline for 10 minutes.
- Offline for an entire shift.
- Device crash mid-order.
- Two terminals offline on same outlet.
- Internet returns during payment.
- Duplicate webhook after reconnection.
- Printer offline while POS remains available.
