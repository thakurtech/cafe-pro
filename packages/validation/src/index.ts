import { z } from 'zod';

export const uuidSchema = z.string().uuid();

export const createOrderSchema = z.object({
  outletId: uuidSchema,
  channel: z.enum(['POS', 'QR', 'WEBSITE', 'SWIGGY', 'ZOMATO', 'PHONE', 'OTHER']),
  customerId: uuidSchema.optional(),
  tableId: uuidSchema.optional(),
  items: z.array(
    z.object({
      productId: uuidSchema,
      quantity: z.number().int().positive(),
      unitPrice: z.number().nonnegative(),
    }),
  ).min(1),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
