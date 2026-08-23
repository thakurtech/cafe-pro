'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle2, Clock, ChefHat, Check, Share2, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import Link from 'next/link';
import { motion } from 'framer-motion';

const STATUS_STEPS = ['PLACED', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED'];

export default function OrderStatusPage({ params }: { params: Promise<{ slug: string, orderId: string }> }) {
  const unwrappedParams = React.use(params);
  const { slug, orderId } = unwrappedParams;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${API}/storefront/orders/${orderId}`);
        if (res.ok) {
          const data = await res.json();
          const prevStatus = order?.status;
          setOrder(data);
          
          if (data.status === 'READY' && prevStatus !== 'READY') {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, [orderId, order?.status]);

  if (loading || !order) {
    return <div className="min-h-[60vh] flex items-center justify-center">Loading...</div>;
  }

  const currentStepIndex = STATUS_STEPS.indexOf(order.status) !== -1 ? STATUS_STEPS.indexOf(order.status) : 0;
  
  const getStepIcon = (index: number) => {
    if (index === 0) return <Clock size={20} />;
    if (index === 1) return <CheckCircle2 size={20} />;
    if (index === 2) return <ChefHat size={20} />;
    if (index === 3) return <Check size={20} />;
    if (index === 4) return <CheckCircle2 size={20} />;
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'My Order',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      <div className="text-center py-6">
        <h2 className="text-3xl font-bold mb-2">Order #{order.id.slice(-4)}</h2>
        <p className="text-gray-500">
          {order.status === 'READY' ? 'Your order is ready to collect!' : 'We are preparing your order.'}
        </p>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <div className="relative">
           <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-gray-100"></div>
           <motion.div 
             className="absolute left-[19px] top-4 w-0.5 bg-[var(--shop-color)] origin-top"
             initial={{ scaleY: 0 }}
             animate={{ scaleY: currentStepIndex / (STATUS_STEPS.length - 1) }}
             transition={{ duration: 0.5 }}
           ></motion.div>
           
           <div className="space-y-8 relative">
             {STATUS_STEPS.map((step, index) => {
               const isActive = index <= currentStepIndex;
               const isCurrent = index === currentStepIndex;
               return (
                 <div key={step} className={`flex gap-4 items-center ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors ${isActive ? 'bg-[var(--shop-color)] text-white' : 'bg-gray-100 text-gray-400'}`}>
                     {getStepIcon(index)}
                   </div>
                   <div>
                     <h4 className={`font-semibold ${isCurrent ? 'text-[var(--shop-color)]' : 'text-gray-900'}`}>{step.charAt(0) + step.slice(1).toLowerCase()}</h4>
                     {isCurrent && <p className="text-xs text-gray-500">Just now</p>}
                   </div>
                 </div>
               );
             })}
           </div>
        </div>
      </div>

      {order.status === 'COMPLETED' && (
        <div className="bg-green-50 text-green-800 rounded-2xl p-4 text-center">
           <p className="font-semibold">Thank you! Come back soon 🙏</p>
        </div>
      )}

      {/* Summary */}
      <div className="bg-white rounded-2xl shadow-sm border p-4 space-y-4">
        <h3 className="font-semibold border-b pb-2">Order Summary</h3>
        <div className="space-y-3">
          {order.items.map((item: any, i: number) => (
            <div key={i} className="flex justify-between text-sm">
              <div>
                <span className="font-medium">{item.quantity}x</span> {item.name}
              </div>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>
        <div className="border-t pt-3 flex justify-between font-bold text-lg">
          <span>Total Paid</span>
          <span>₹{order.total}</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">Payment Method: {order.paymentMethod}</p>
      </div>

      <div className="flex gap-4">
        <button onClick={handleShare} className="flex-1 py-3 border border-gray-200 rounded-xl font-medium flex items-center justify-center gap-2 text-gray-700 bg-white shadow-sm">
          <Share2 size={18} /> Share
        </button>
        <Link href={`/shop/${slug}`} className="flex-1 py-3 bg-[var(--shop-color)] text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-sm">
          <ArrowLeft size={18} /> Menu
        </Link>
      </div>
    </div>
  );
}
