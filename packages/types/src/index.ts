export type ID = string;

export type OrderChannel =
  | 'POS'
  | 'QR'
  | 'WEBSITE'
  | 'SWIGGY'
  | 'ZOMATO'
  | 'PHONE'
  | 'OTHER';

export type OrderStatus =
  | 'DRAFT'
  | 'PLACED'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'READY'
  | 'SERVED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED';

export interface TenantContext {
  tenantId: ID;
  outletId?: ID;
  userId?: ID;
}
