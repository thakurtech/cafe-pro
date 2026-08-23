'use client';

import { useEffect, useRef } from 'react';
import { useCart, ShopData } from '@/lib/cart-context';

export default function ClientLayoutInit({ slug, shopData }: { slug: string; shopData: ShopData }) {
  const { initShop } = useCart();
  const initializedSlug = useRef<string>('');
  
  useEffect(() => {
    if (initializedSlug.current !== slug) {
      initializedSlug.current = slug;
      initShop(slug, {
        name: shopData.name,
        themeColor: shopData.themeColor,
        logo: shopData.logo,
        tagline: shopData.tagline,
      });
    }
  }, [slug, shopData, initShop]);

  return null;
}
