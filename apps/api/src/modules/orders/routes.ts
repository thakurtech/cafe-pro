import { Router } from 'express';
import { createOrderSchema } from '@restaurant-os/validation';
import { canTransitionOrder } from '@restaurant-os/domain';
import { createServerSupabaseAdmin } from '@restaurant-os/db/src/server.js';
import crypto from 'crypto';

export const ordersRouter = Router();

ordersRouter.post('/', async (req, res) => {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() });
  }

  const allowed = canTransitionOrder('DRAFT', 'PLACED');
  if (!allowed) return res.status(500).json({ error: 'INVALID_ORDER_STATE' });

  try {
    const supabase = createServerSupabaseAdmin();
    const data = parsed.data;

    // Fetch outlet to get tenant_id
    const { data: outlet, error: outletError } = await supabase
      .from('outlets')
      .select('tenant_id')
      .eq('id', data.outletId)
      .single();

    if (outletError || !outlet) {
      return res.status(400).json({ error: 'INVALID_OUTLET', details: outletError?.message });
    }

    const tenantId = outlet.tenant_id;

    // Fetch products to get names
    const productIds = data.items.map((i) => i.productId);
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name')
      .in('id', productIds);

    if (productsError) {
      return res.status(500).json({ error: 'DATABASE_ERROR', details: productsError.message });
    }

    const productsMap = new Map(products?.map((p) => [p.id, p.name]) || []);

    const orderId = crypto.randomUUID();
    let subtotal = 0;

    const orderItemsToInsert = data.items.map((item) => {
      const lineTotal = item.unitPrice * item.quantity;
      subtotal += lineTotal;
      return {
        id: crypto.randomUUID(),
        order_id: orderId,
        product_id: item.productId,
        product_name: productsMap.get(item.productId) || 'Unknown Product',
        quantity: item.quantity,
        unit_price: item.unitPrice,
        total_price: lineTotal,
      };
    });

    const tax = 0; // Simple MVP
    const total = subtotal + tax;

    // Insert order
    const { data: orderResult, error: orderError } = await supabase
      .from('orders')
      .insert({
        id: orderId,
        tenant_id: tenantId,
        outlet_id: data.outletId,
        channel: data.channel,
        status: 'PLACED',
        customer_id: data.customerId || null,
        subtotal,
        tax,
        total,
      })
      .select()
      .single();

    if (orderError) {
      return res.status(500).json({ error: 'DATABASE_ERROR', details: orderError.message });
    }

    // Insert order items
    if (orderItemsToInsert.length > 0) {
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsToInsert);

      if (itemsError) {
        return res.status(500).json({ error: 'DATABASE_ERROR', details: itemsError.message });
      }
    }

    const createdOrder = {
      id: orderResult.id,
      tenantId: orderResult.tenant_id,
      outletId: orderResult.outlet_id,
      channel: orderResult.channel,
      status: orderResult.status,
      customerId: orderResult.customer_id,
      subtotal: orderResult.subtotal,
      tax: orderResult.tax,
      total: orderResult.total,
      items: orderItemsToInsert.map(item => ({
        id: item.id,
        productId: item.product_id,
        productName: item.product_name,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        totalPrice: item.total_price,
      })),
      createdAt: orderResult.created_at,
      updatedAt: orderResult.updated_at,
    };

    return res.status(201).json(createdOrder);
  } catch (error: any) {
    console.error('Error creating order:', error);
    return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', details: error.message });
  }
});
