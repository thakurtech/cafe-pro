export type AppRole = 'OWNER' | 'MANAGER' | 'CASHIER' | 'KITCHEN' | 'STAFF' | 'PLATFORM_ADMIN';

export function assertRole(role: AppRole, allowed: AppRole[]) {
  if (!allowed.includes(role)) {
    throw new Error('Forbidden');
  }
}
