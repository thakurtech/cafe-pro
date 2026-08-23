# User Roles and Permissions

## Roles
- Owner
- Manager
- Cashier
- Captain
- Kitchen
- Accountant
- Marketing
- Platform Admin

## Permission principles
1. Least privilege.
2. Money-changing actions require elevated permission.
3. Configuration changes are audited.
4. Owner can grant/revoke permissions except platform-only controls.
5. Outlet scope applies to outlet users.

## Example matrix
| Capability | Owner | Manager | Cashier | Captain | Kitchen | Accountant | Marketing |
|---|---|---|---|---|---|---|---|
| Create orders | Yes | Yes | Yes | Yes | No | No | No |
| Take payment | Yes | Yes | Yes | Optional | No | No | No |
| Refund | Yes | Configurable | Limited | No | No | Limited | No |
| Change menu | Yes | Yes | No | No | No | No | No |
| Change price | Yes | Configurable | No | No | No | No | No |
| View sales | Yes | Yes | Limited | Limited | Limited | Yes | Campaign view |
| View profit | Yes | Configurable | No | No | No | Yes | No |
| Manage inventory | Yes | Yes | No | No | No | Read | No |
| Manage staff | Yes | Yes | No | No | No | No | No |
| Manage campaigns | Yes | Yes | No | No | No | No | Yes |
| Manage loyalty | Yes | Yes | No | No | No | No | Yes |
| Configure payments | Yes | Limited | No | No | No | No | No |
| Configure tax | Yes | Limited | No | No | No | Yes | No |
| View KDS | Yes | Yes | Yes | Yes | Yes | No | No |

Final permissions must be implemented as granular capabilities, not hard-coded role checks.
