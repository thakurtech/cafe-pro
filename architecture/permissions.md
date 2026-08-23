# Authorization Architecture

Use capability-based permissions with scopes.

Example capability:
`orders.refund`
Scope:
`outlet:123`

Do not encode authorization only as role names in backend code.

Recommended permission families:
- orders.*
- payments.*
- billing.*
- inventory.*
- menu.*
- kitchen.*
- customers.*
- loyalty.*
- promotions.*
- campaigns.*
- staff.*
- analytics.*
- integrations.*
- subscriptions.*
- settings.*

Audit every privileged action.
