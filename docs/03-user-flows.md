# Core User Flows

## A. Merchant onboarding
Signup -> plan -> tenant -> outlet -> business profile -> menu -> taxes -> payments -> printers/devices -> test order -> QR -> publish.

## B. Customer QR order
Scan -> storefront -> menu -> item -> modifier -> recommendation -> cart -> mobile number optional -> payment -> order confirmation -> preparation -> pickup/serve -> reward -> optional game -> return.

## C. POS order
Login -> choose order type -> table/customer optional -> add products -> modifiers -> promotion validation -> payment -> invoice -> KOT -> kitchen -> completion -> ledger/events.

## D. Offline order
Device detects offline -> local order -> local validation -> local print -> local state -> sync queue -> connection restores -> idempotent upload -> server ack -> local tombstone/mark synced.

## E. Refund
Authorized user -> locate order -> choose whole/partial -> reason -> refund payment where supported -> reverse loyalty/points if applicable -> update inventory if relevant -> audit -> customer notification.

## F. Loyalty redemption
Customer identity -> view balance -> validate reward -> reserve/redeem -> apply discount -> ledger entry -> completion. Failed transaction must release reservation.

## G. Referral
Customer generates code -> friend lands -> attribution cookie/token -> eligibility -> first qualifying order -> reward ledger -> notification.

## H. Campaign
Merchant selects segment -> offer -> channel -> schedule -> approval -> send/queue -> delivery status -> redemption attribution -> campaign report.

## I. Swiggy/Zomato order
Provider adapter receives event -> verify authenticity -> map provider order -> canonical order -> KOT/KDS -> payment status -> provider status update -> reconciliation event.

## J. Migration
Import source data -> mapping -> validation -> exception list -> test environment -> parallel run -> go-live checkpoint -> final cutover -> legacy archival.
