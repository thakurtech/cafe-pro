# Supabase Functions

Do not add business logic here by default.

Express is the primary backend boundary. Supabase Edge Functions are reserved for cases where their execution environment is materially better suited, such as narrow platform-native jobs that do not belong in the main API.

Any function introduced here must document:

- why it cannot/should not live in Express
- authentication model
- secrets used
- retry/idempotency behavior
- observability
