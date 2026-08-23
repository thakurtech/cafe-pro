import React from 'react';
import { notFound } from 'next/navigation';
import { CartProvider } from '@/lib/cart-context';
import ClientLayoutInit from './client-init';
import ShopHeader from './shop-header';

async function getShopData(slug: string) {
  try {
    const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${API}/storefront/${slug}`, { cache: 'no-store' });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch shop data');
    }
    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function ShopLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const shopData = await getShopData(slug);

  if (!shopData) {
    notFound();
  }

  if (shopData.subscription?.status === 'SUSPENDED') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border">
          <div className="text-6xl mb-4">☕</div>
          <h1 className="text-2xl font-bold mb-2 text-gray-800">Temporarily Unavailable</h1>
          <p className="text-gray-500">This shop is currently not accepting orders. Please check back later.</p>
        </div>
      </div>
    );
  }

  const themeColor = shopData.themeColor || '#4F46E5';

  return (
    <CartProvider>
      <ClientLayoutInit slug={slug} shopData={shopData} />
      <div
        className="min-h-screen bg-slate-100 pb-20 flex flex-col"
        style={{
          '--shop-color': themeColor,
        } as React.CSSProperties}
      >
        <ShopHeader slug={slug} shopData={shopData} />
        <main className="flex-1 w-full max-w-md mx-auto bg-white shadow-sm border-x border-slate-200">
          {children}
        </main>
        <footer className="text-center py-6 text-xs text-slate-400 bg-slate-100">
          Powered by <span className="font-bold text-slate-600">CafeOS</span>
        </footer>
      </div>
    </CartProvider>
  );
}
