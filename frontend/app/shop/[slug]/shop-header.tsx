'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, User, Coffee } from 'lucide-react';
import { useCart, ShopData } from '@/lib/cart-context';

export default function ShopHeader({ slug, shopData }: { slug: string; shopData: ShopData }) {
  const { state } = useCart();
  const themeColor = shopData.themeColor || '#4F46E5';

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm h-16 px-4 flex items-center justify-between">
      <Link href={`/shop/${slug}`} className="flex items-center gap-2.5">
        {shopData.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={shopData.logo} alt={shopData.name} className="w-9 h-9 rounded-xl object-cover shadow-sm" />
        ) : (
          <div
            className="w-9 h-9 rounded-xl text-white flex items-center justify-center font-bold text-sm shadow-sm"
            style={{ backgroundColor: themeColor }}
          >
            {shopData.name.charAt(0).toUpperCase()}
          </div>
        )}
        <h1 className="font-extrabold text-base text-slate-900 truncate max-w-[180px]">{shopData.name}</h1>
      </Link>

      <div className="flex items-center gap-1.5">
        <Link href={`/shop/${slug}/profile`} className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
          <User size={19} />
        </Link>
        <Link href={`/shop/${slug}/checkout`} className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
          <ShoppingCart size={19} />
          {state.totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-scale-in">
              {state.totalItems}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
