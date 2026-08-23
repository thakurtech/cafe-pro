import { Router } from 'express';
import { createServerSupabaseAdmin } from '@restaurant-os/db/src/server.js';
import type { Product } from '@restaurant-os/types';

export const menuRouter = Router();

menuRouter.get('/:outletId', async (req, res) => {
  try {
    const { outletId } = req.params;
    const supabase = createServerSupabaseAdmin();

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('outlet_id', outletId)
      .eq('is_active', true);

    if (error) {
      return res.status(500).json({ error: 'DATABASE_ERROR', details: error.message });
    }

    const products: Product[] = (data || []).map((item: any) => ({
      id: item.id,
      tenantId: item.tenant_id,
      name: item.name,
      description: item.description,
      price: item.price,
      imageUrl: item.image_url,
      isAvailable: item.is_active,
      categoryId: item.category_id,
    }));

    return res.json(products);
  } catch (error) {
    return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
  }
});
