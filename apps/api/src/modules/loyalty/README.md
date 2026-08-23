# loyalty module

Implement this bounded context according to the PRD and architecture docs.

Rules:
- tenant/outlet authorization is mandatory
- mutations must be idempotent where externally retryable
- emit domain events where specified
- do not place third-party provider logic directly in controllers
