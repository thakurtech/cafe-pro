import { Router } from 'express';
import { createOrderSchema } from '@restaurant-os/validation';
import { canTransitionOrder } from '@restaurant-os/domain';

export const ordersRouter = Router();

ordersRouter.post('/', (req, res) => {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() });
  }

  // TODO: replace with application service + transaction + outbox/event emission.
  const orderId = crypto.randomUUID();
  const allowed = canTransitionOrder('DRAFT', 'PLACED');
  if (!allowed) return res.status(500).json({ error: 'INVALID_ORDER_STATE' });

  return res.status(201).json({
    id: orderId,
    status: 'PLACED',
    ...parsed.data,
  });
});
