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

// --- CORE SCHEMA AGREEMENT ---

export interface Product {
  id: ID;
  tenantId: ID;
  name: string;
  description?: string;
  price: number; // Stored in cents/paise to avoid float issues
  imageUrl?: string;
  isAvailable: boolean;
  categoryId?: ID;
}

export interface OrderItem {
  id: ID;
  productId: ID;
  productName: string; // Snapshot of the name at time of order
  quantity: number;
  unitPrice: number; // Snapshot of price at time of order
  totalPrice: number; 
  notes?: string;
}

export interface Order {
  id: ID;
  tenantId: ID;
  outletId: ID;
  channel: OrderChannel;
  status: OrderStatus;
  
  // Customer info (Optional for guest checkouts)
  customerId?: ID;
  customerName?: string;
  customerPhone?: string;

  // Financials
  subtotal: number;
  tax: number;
  total: number;
  
  // Array of items in the order
  items: OrderItem[];

  // Timestamps
  createdAt: string; // ISO String
  updatedAt: string; // ISO String
}
