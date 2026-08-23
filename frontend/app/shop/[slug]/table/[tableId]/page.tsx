'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { motion } from 'framer-motion';
import { Coffee } from 'lucide-react';

export default function TableQRPage({ params }: { params: Promise<{ slug: string, tableId: string }> }) {
  const unwrappedParams = React.use(params);
  const { slug, tableId } = unwrappedParams;
  const router = useRouter();
  const { setTable, state } = useCart();

  useEffect(() => {
    setTable(tableId, tableId);
  }, [tableId, setTable]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-24 h-24 bg-[var(--shop-color)]/10 text-[var(--shop-color)] rounded-full flex items-center justify-center mb-6"
      >
        <Coffee size={40} />
      </motion.div>
      
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-3xl font-bold mb-2"
      >
        Welcome to {state.shopData?.name || 'our café'}!
      </motion.h1>
      
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-gray-500 mb-8"
      >
        You are seated at Table {tableId}
      </motion.p>
      
      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        onClick={() => router.push(`/shop/${slug}?table=${tableId}`)}
        className="bg-[var(--shop-color)] text-white px-8 py-4 rounded-full font-bold shadow-xl hover:shadow-2xl transition-shadow w-full max-w-xs"
      >
        Browse Menu
      </motion.button>
    </div>
  );
}
