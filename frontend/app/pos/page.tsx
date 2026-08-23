"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Trash2, 
  Minus, 
  Plus, 
  ChevronLeft, 
  CreditCard, 
  Banknote, 
  Smartphone,
  PauseCircle,
  PlayCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Mock Categories & Items
const CATEGORIES = ["All", "Coffee", "Tea", "Food", "Desserts", "Cold Beverages"];
const MENU = [
  { id: '1', name: 'Cappuccino', category: 'Coffee', price: 150, color: 'bg-amber-100 border-amber-200 text-amber-900' },
  { id: '2', name: 'Latte', category: 'Coffee', price: 160, color: 'bg-amber-100 border-amber-200 text-amber-900' },
  { id: '3', name: 'Espresso', category: 'Coffee', price: 120, color: 'bg-amber-100 border-amber-200 text-amber-900' },
  { id: '4', name: 'Masala Chai', category: 'Tea', price: 80, color: 'bg-orange-100 border-orange-200 text-orange-900' },
  { id: '5', name: 'Green Tea', category: 'Tea', price: 90, color: 'bg-orange-100 border-orange-200 text-orange-900' },
  { id: '6', name: 'French Fries', category: 'Food', price: 120, color: 'bg-red-100 border-red-200 text-red-900' },
  { id: '7', name: 'Veg Burger', category: 'Food', price: 180, color: 'bg-red-100 border-red-200 text-red-900' },
  { id: '8', name: 'Margherita Pizza', category: 'Food', price: 299, color: 'bg-red-100 border-red-200 text-red-900' },
  { id: '9', name: 'Choco Lava Cake', category: 'Desserts', price: 140, color: 'bg-pink-100 border-pink-200 text-pink-900' },
  { id: '10', name: 'Cold Coffee', category: 'Cold Beverages', price: 180, color: 'bg-blue-100 border-blue-200 text-blue-900' },
  { id: '11', name: 'Mojito', category: 'Cold Beverages', price: 150, color: 'bg-blue-100 border-blue-200 text-blue-900' },
];

export default function POSPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  
  const [cart, setCart] = useState<any[]>([]);
  const [orderType, setOrderType] = useState("dine-in");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [heldOrders, setHeldOrders] = useState<any[]>([]);
  
  // Totals
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const tax = subtotal * 0.05; // 5% GST
  const total = subtotal + tax;

  const filteredMenu = MENU.filter(item => 
    (activeCategory === "All" || item.category === activeCategory) &&
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart(prev => {
      return prev.map(i => {
        if (i.id === id) {
          const newQty = i.qty + delta;
          return newQty > 0 ? { ...i, qty: newQty } : i;
        }
        return i;
      });
    });
  };

  const removeItem = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setSelectedTable(null);
  };

  const handleHoldOrder = () => {
    if (cart.length === 0) return;
    const newHeld = {
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      cart: [...cart],
      time: new Date().toLocaleTimeString(),
      total,
      type: orderType
    };
    setHeldOrders([...heldOrders, newHeld]);
    clearCart();
    toast.success("Order put on hold");
  };

  const resumeOrder = (held: any) => {
    if (cart.length > 0) {
      toast.error("Please clear or hold current order first");
      return;
    }
    setCart(held.cart);
    setOrderType(held.type);
    setHeldOrders(heldOrders.filter(h => h.id !== held.id));
    toast.success("Order resumed");
  };

  const placeOrder = () => {
    if (cart.length === 0) return;
    
    // Simulate API
    toast.success("Order placed successfully!", { duration: 3000 });
    // In real app: show receipt modal, then clear
    clearCart();
  };

  return (
    <div className="flex flex-col h-screen bg-slate-100 overflow-hidden">
      {/* Top Header */}
      <header className="h-14 bg-white border-b flex items-center justify-between px-4 shrink-0 shadow-sm z-10">
        <div className="flex items-center">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="mr-2">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-slate-800">CofeeOS POS</h1>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <Input 
              className="w-64 pl-9 bg-slate-50 border-slate-200" 
              placeholder="Search menu..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-slate-600">Demo Shop</span>
          <div className="w-8 h-8 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center font-bold">
            S
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT: Categories */}
        <div className="w-24 md:w-32 bg-white border-r flex flex-col items-center py-4 gap-2 overflow-y-auto no-scrollbar shrink-0">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "w-20 md:w-28 py-3 px-2 rounded-xl text-xs md:text-sm font-medium transition-all text-center leading-tight",
                activeCategory === cat 
                  ? "bg-emerald-600 text-white shadow-md scale-105" 
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* CENTER: Menu Items */}
        <div className="flex-1 bg-slate-50 p-4 overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredMenu.map(item => (
              <div 
                key={item.id}
                onClick={() => addToCart(item)}
                className={cn(
                  "relative p-4 rounded-2xl cursor-pointer select-none transition-transform active:scale-95 border-2 hover:shadow-md flex flex-col justify-between h-32",
                  item.color, "bg-opacity-50"
                )}
              >
                <div className="font-bold text-sm md:text-base leading-tight">
                  {item.name}
                </div>
                <div className="font-black text-lg mt-2">
                  ₹{item.price}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Order Ticket */}
        <div className="w-96 bg-white border-l flex flex-col shrink-0 z-10 shadow-xl">
          {/* Order Type Tabs */}
          <div className="p-3 border-b bg-slate-50">
            <Tabs value={orderType} onValueChange={setOrderType} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="dine-in">Dine In</TabsTrigger>
                <TabsTrigger value="takeaway">Takeaway</TabsTrigger>
                <TabsTrigger value="delivery">Delivery</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-2 bg-slate-50/50">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-slate-300" />
                </div>
                <p>No items in current order</p>
              </div>
            ) : (
              <div className="space-y-2">
                {cart.map(item => (
                  <div key={item.id} className="flex p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800">{item.name}</h4>
                      <p className="font-semibold text-emerald-600">₹{item.price * item.qty}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-slate-300" onClick={() => updateQty(item.id, -1)}>
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="font-bold w-4 text-center">{item.qty}</span>
                      <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-slate-300" onClick={() => updateQty(item.id, 1)}>
                        <Plus className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => removeItem(item.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Held Orders Quick Access */}
          {heldOrders.length > 0 && (
            <div className="bg-amber-50 border-t border-amber-200 p-2 flex gap-2 overflow-x-auto no-scrollbar">
              {heldOrders.map((held) => (
                <Badge 
                  key={held.id} 
                  variant="outline" 
                  className="bg-white border-amber-300 text-amber-800 cursor-pointer hover:bg-amber-100 shrink-0 flex items-center gap-1"
                  onClick={() => resumeOrder(held)}
                >
                  <PlayCircle className="w-3 h-3" /> #{held.id} (₹{held.total})
                </Badge>
              ))}
            </div>
          )}

          {/* Order Summary & Actions */}
          <div className="border-t bg-white p-4 space-y-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax (5%)</span>
                <span className="font-semibold">₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-black text-slate-900 pt-2 border-t mt-2">
                <span>TOTAL</span>
                <span className="text-emerald-600">₹{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Button 
                variant="outline" 
                className={cn("h-12 border-2", paymentMethod === 'Cash' && "border-emerald-500 bg-emerald-50")}
                onClick={() => setPaymentMethod('Cash')}
              >
                <Banknote className="w-4 h-4 mr-1.5" /> Cash
              </Button>
              <Button 
                variant="outline" 
                className={cn("h-12 border-2", paymentMethod === 'UPI' && "border-emerald-500 bg-emerald-50")}
                onClick={() => setPaymentMethod('UPI')}
              >
                <Smartphone className="w-4 h-4 mr-1.5" /> UPI
              </Button>
              <Button 
                variant="outline" 
                className={cn("h-12 border-2", paymentMethod === 'Card' && "border-emerald-500 bg-emerald-50")}
                onClick={() => setPaymentMethod('Card')}
              >
                <CreditCard className="w-4 h-4 mr-1.5" /> Card
              </Button>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 h-14 bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100" onClick={handleHoldOrder} disabled={cart.length === 0}>
                <PauseCircle className="w-5 h-5 mr-2" /> Hold
              </Button>
              <Button className="flex-[2] h-14 bg-emerald-600 hover:bg-emerald-700 text-lg font-bold text-white shadow-lg" onClick={placeOrder} disabled={cart.length === 0}>
                Pay ₹{total.toFixed(0)}
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
