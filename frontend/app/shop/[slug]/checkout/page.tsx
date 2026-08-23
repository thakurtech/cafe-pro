'use client';

import React, { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { useRouter } from 'next/navigation';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';

export default function CheckoutPage({ params }: { params: Promise<{ slug: string }> }) {
  const unwrappedParams = React.use(params);
  const slug = unwrappedParams.slug;
  const { state, updateQuantity, removeItem, clearCart } = useCart();
  const router = useRouter();
  
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'RAZORPAY' | 'PAY_AT_COUNTER'>('RAZORPAY');
  const [loading, setLoading] = useState(false);

  const tax = state.subtotal * 0.05; // 5% GST
  const total = state.subtotal + tax;

  const handleCheckout = async () => {
    if (state.items.length === 0) return;
    setLoading(true);
    
    try {
      const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      
      const orderPayload = {
        items: state.items,
        customerDetails: { phone, name, notes },
        paymentMethod,
        tableId: state.tableId,
        subtotal: state.subtotal,
        tax,
        total,
      };

      const res = await fetch(`${API}/storefront/${slug}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) throw new Error('Order creation failed');
      
      const orderData = await res.json();

      if (paymentMethod === 'PAY_AT_COUNTER') {
        clearCart();
        router.push(`/shop/${slug}/order/${orderData.id}`);
      } else {
        // Razorpay flow
        const rzpRes = await fetch(`${API}/payments/create-order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: total, orderId: orderData.id }),
        });
        const rzpData = await rzpRes.json();
        
        const loadScript = () => new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
        
        await loadScript();
        
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_TTLrwmJ6bc120H',
          amount: rzpData.amount,
          currency: "INR",
          name: state.shopData?.name,
          description: "Order Payment",
          order_id: rzpData.id,
          handler: async function (response: any) {
             await fetch(`${API}/payments/verify`, {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({
                 razorpay_order_id: response.razorpay_order_id,
                 razorpay_payment_id: response.razorpay_payment_id,
                 razorpay_signature: response.razorpay_signature,
                 orderId: orderData.id
               }),
             });
              clearCart();
              router.push(`/shop/${slug}/order/${orderData.id}`);
            },
            theme: {
              color: 'var(--shop-color, #6366F1)'
            }
          };
          
          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        }
    } catch (error) {
      console.error(error);
      alert('Checkout error');
    } finally {
      setLoading(false);
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
        <button
          onClick={() => router.push(`/shop/${slug}`)}
          className="bg-[var(--shop-color)] text-white px-6 py-2 rounded-full font-medium"
        >
          Browse Menu
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 pb-24">
      <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>
      
      {/* Items */}
      <div className="bg-white rounded-2xl shadow-sm border p-4 space-y-4">
        {state.items.map((item) => (
          <div key={item.id} className="flex gap-4 py-2 border-b last:border-0 last:pb-0">
             <div className="flex-1">
               <h4 className="font-semibold text-gray-900">{item.name}</h4>
               {item.modifiers?.map((m, i) => (
                 <div key={i} className="text-xs text-gray-500">+ {m.name} (₹{m.price})</div>
               ))}
               <div className="font-medium mt-1">₹{item.price * item.quantity}</div>
             </div>
             <div className="flex items-center gap-3">
               <button onClick={() => {
                 if (item.quantity === 1) removeItem(item.id);
                 else updateQuantity(item.id, item.quantity - 1);
               }} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                 {item.quantity === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
               </button>
               <span className="font-medium w-4 text-center">{item.quantity}</span>
               <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-full bg-[var(--shop-color)]/10 text-[var(--shop-color)] flex items-center justify-center">
                 <Plus size={14} />
               </button>
             </div>
          </div>
        ))}
      </div>

      {/* Bill Details */}
      <div className="bg-white rounded-2xl shadow-sm border p-4 space-y-2">
         <h3 className="font-semibold mb-3">Bill Details</h3>
         <div className="flex justify-between text-gray-600 text-sm">
           <span>Subtotal</span>
           <span>₹{state.subtotal}</span>
         </div>
         <div className="flex justify-between text-gray-600 text-sm">
           <span>Taxes (5%)</span>
           <span>₹{tax.toFixed(2)}</span>
         </div>
         <div className="border-t my-2 pt-2 flex justify-between font-bold text-lg">
           <span>To Pay</span>
           <span>₹{total.toFixed(2)}</span>
         </div>
      </div>

      {/* Details */}
      <div className="bg-white rounded-2xl shadow-sm border p-4 space-y-4">
        <h3 className="font-semibold">Customer Details</h3>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number (Optional)</label>
          <input 
            type="tel" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border rounded-xl px-3 py-2 text-sm focus:ring-[var(--shop-color)] focus:border-[var(--shop-color)]"
            placeholder="For order updates & loyalty points"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Name (Optional)</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-xl px-3 py-2 text-sm focus:ring-[var(--shop-color)] focus:border-[var(--shop-color)]"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Any instructions?</label>
          <input 
            type="text" 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border rounded-xl px-3 py-2 text-sm focus:ring-[var(--shop-color)] focus:border-[var(--shop-color)]"
            placeholder="E.g. less spicy, extra sugar"
          />
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-2xl shadow-sm border p-4 space-y-3">
         <h3 className="font-semibold">Payment Method</h3>
         <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${paymentMethod === 'RAZORPAY' ? 'border-[var(--shop-color)] bg-[var(--shop-color)]/5' : ''}`}>
           <input type="radio" name="payment" checked={paymentMethod === 'RAZORPAY'} onChange={() => setPaymentMethod('RAZORPAY')} className="text-[var(--shop-color)]" />
           <div className="flex-1 font-medium">Pay Now (UPI, Cards)</div>
         </label>
         <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${paymentMethod === 'PAY_AT_COUNTER' ? 'border-[var(--shop-color)] bg-[var(--shop-color)]/5' : ''}`}>
           <input type="radio" name="payment" checked={paymentMethod === 'PAY_AT_COUNTER'} onChange={() => setPaymentMethod('PAY_AT_COUNTER')} className="text-[var(--shop-color)]" />
           <div className="flex-1 font-medium">Pay at Counter (Cash / Counter UPI)</div>
         </label>
      </div>

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="fixed bottom-4 left-4 right-4 max-w-md mx-auto bg-[var(--shop-color)] text-white p-4 rounded-2xl shadow-xl font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-70 z-50"
      >
        {loading ? 'Processing...' : `Place Order (₹${total.toFixed(2)})`}
        {!loading && <ArrowRight size={20} />}
      </button>
    </div>
  );
}
