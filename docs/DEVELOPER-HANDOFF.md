# Developer Handoff

## Read order
1. `00-product-vision.md`
2. `01-prd.md`
3. `02-user-roles.md`
4. `03-user-flows.md`
5. `04-information-architecture.md`
6. `13-mvp-scope.md`
7. `15-open-decisions.md`
8. `architecture/system-architecture.md`
9. `architecture/database-schema.md`
10. `architecture/offline-architecture.md`

## Engineering rules
- Treat the PRD as source of truth.
- Raise an issue when a requirement is ambiguous.
- Do not hard-code plan names/prices.
- Do not bypass tenant authorization in internal endpoints.
- Use immutable ledgers for financial/reward/inventory movements.
- Make retriable mutations idempotent.
- Write tests around order state transitions.
- Test offline recovery before calling POS complete.
- Do not build provider-specific logic into domain services.
- Every production incident should result in an observable metric/log/alert or test if appropriate.

## Definition of done
A feature is done when:
1. Product requirement is implemented.
2. Acceptance criteria pass.
3. Unit/integration tests exist where risk warrants.
4. Authorization is enforced server-side.
5. Tenant/outlet boundaries are tested.
6. Error and retry behavior is defined.
7. Relevant analytics/audit events exist.
8. Documentation is updated.
9. UI is responsive for intended surface.
10. No unresolved critical defects remain.
