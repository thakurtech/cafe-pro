# Security and Trust Requirements

## Core controls
- Tenant isolation at authorization and data-access layers.
- RBAC with granular permissions.
- Secure session management.
- MFA option/recommendation for owners.
- Sensitive-action reauthentication.
- Audit logs.
- Encryption in transit and at rest where appropriate.
- Secrets manager; never commit secrets.
- Backups and restore tests.
- Rate limiting.
- Abuse/fraud controls for rewards and games.

## Audit events
At minimum:
- login/logout
- role/permission change
- price change
- tax configuration change
- refund
- void/cancel
- discount override
- loyalty adjustment
- gift card issue/redeem
- campaign change
- payment settings change
- data export
- support impersonation

## Data minimization
Only collect customer fields that serve an identifiable product purpose. Do not require OTP or account creation merely because it is convenient for the platform.

## Customer trust
Merchant-scoped data and export rights must be clearly defined in contracts and product terms.
