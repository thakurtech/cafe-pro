export interface DomainEvent<TPayload = unknown> {
  eventId: string;
  eventType: string;
  tenantId: string;
  outletId?: string;
  aggregateId: string;
  occurredAt: string;
  version: number;
  payload: TPayload;
}

export type RestaurantEventType =
  | 'ORDER_CREATED'
  | 'ORDER_STATUS_CHANGED'
  | 'PAYMENT_RECORDED'
  | 'ORDER_COMPLETED'
  | 'ORDER_REFUNDED'
  | 'INVENTORY_DEDUCTED'
  | 'LOYALTY_EARNED'
  | 'LOYALTY_REDEEMED'
  | 'CUSTOMER_CREATED'
  | 'CUSTOMER_UPDATED'
  | 'GAME_PLAYED'
  | 'REFERRAL_CONVERTED';
