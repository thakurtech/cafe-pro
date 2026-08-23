'use client';

import React, { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { Gift, Clock, LogOut } from 'lucide-react';

export default function ProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const unwrappedParams = React.use(params);
  const slug = unwrappedParams.slug;
  const { state } = useCart();
  const [phone, setPhone] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10) setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return (
      <div className="p-6 min-h-[70vh] flex flex-col items-center justify-center">
         <div className="w-20 h-20 bg-[var(--shop-color)]/10 text-[var(--shop-color)] rounded-full flex items-center justify-center mb-6">
           <Gift size={32} />
         </div>
         <h2 className="text-2xl font-bold mb-2 text-center">Loyalty & Rewards</h2>
         <p className="text-gray-500 text-center mb-8">Enter your phone number to check points and past orders.</p>
         
         <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
           <input 
             type="tel"
             placeholder="Mobile Number"
             value={phone}
             onChange={(e) => setPhone(e.target.value)}
             className="w-full px-4 py-3 rounded-xl border text-lg focus:ring-[var(--shop-color)] focus:border-[var(--shop-color)]"
             required
           />
           <button type="submit" className="w-full bg-[var(--shop-color)] text-white py-3 rounded-xl font-bold text-lg">
             Continue
           </button>
         </form>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 pb-24">
       <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold">My Profile</h2>
         <button onClick={() => setIsLoggedIn(false)} className="text-gray-500 p-2"><LogOut size={20} /></button>
       </div>
       
       {/* Points Card */}
       <div className="bg-gradient-to-br from-[var(--shop-color)] to-purple-600 rounded-2xl p-6 text-white shadow-lg">
         <p className="opacity-90 font-medium mb-1">Available Points</p>
         <h3 className="text-4xl font-bold">120</h3>
         <p className="text-sm mt-4 opacity-80">Use points for discounts on your next order.</p>
       </div>

       {/* Recent Orders */}
       <div className="space-y-4">
         <h3 className="font-bold text-lg flex items-center gap-2"><Clock size={20}/> Recent Orders</h3>
         {[1, 2, 3].map((i) => (
           <div key={i} className="bg-white rounded-2xl border p-4 shadow-sm">
             <div className="flex justify-between mb-2">
               <span className="font-semibold">Order #102{i}</span>
               <span className="text-sm text-gray-500">2 days ago</span>
             </div>
             <p className="text-sm text-gray-600 mb-3">2x Cappuccino, 1x Croissant</p>
             <div className="flex justify-between items-center">
               <span className="font-bold">₹350</span>
               <button className="text-sm font-medium text-[var(--shop-color)] bg-[var(--shop-color)]/10 px-3 py-1.5 rounded-lg">
                 Reorder
               </button>
             </div>
           </div>
         ))}
       </div>
    </div>
  );
}
