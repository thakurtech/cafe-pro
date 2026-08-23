'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { Plus, Minus, Info, X, Check, Coffee } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface ModifierOption {
  id: string;
  name: string;
  price: number;
}

interface ModifierGroup {
  id: string;
  name: string;
  minSelect: number;
  maxSelect: number;
  options: ModifierOption[];
}

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  isAvailable: boolean;
  popularityScore: number;
  taxRate: number;
  isVeg: boolean;
  modifiers?: ModifierGroup[];
}

interface MenuCategory {
  id: string;
  name: string;
  sortOrder: number;
  items: MenuItem[];
}

export default function StorefrontHomePage({ params }: { params: Promise<{ slug: string }> }) {
  const unwrappedParams = React.use(params);
  const slug = unwrappedParams.slug;

  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('');
  
  // Modifier selection modal state
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedModifiers, setSelectedModifiers] = useState<ModifierOption[]>([]);
  const [itemNotes, setItemNotes] = useState('');
  const [itemQuantity, setItemQuantity] = useState(1);

  const searchParams = useSearchParams();
  const tableId = searchParams.get('table');
  const { state, setTable, addItem } = useCart();

  useEffect(() => {
    if (tableId) {
      setTable(tableId, `Table ${tableId}`);
    }
  }, [tableId, setTable]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${API}/storefront/${slug}/menu`);
        if (res.ok) {
          const data: MenuCategory[] = await res.json();
          // Filter categories that have items
          const activeCategories = data.filter(c => c.items && c.items.length > 0);
          setCategories(activeCategories);
          if (activeCategories.length > 0) {
            setActiveCategory(activeCategories[0].id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch menu', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [slug]);

  // Collect all items across categories for featured carousel
  const allItems: MenuItem[] = categories.flatMap(c => c.items);
  const featuredItems = allItems
    .filter(item => item.popularityScore > 80)
    .sort((a, b) => b.popularityScore - a.popularityScore);

  const handleOpenModifierModal = (item: MenuItem) => {
    setSelectedItem(item);
    setSelectedModifiers([]);
    setItemNotes('');
    setItemQuantity(1);
  };

  const handleAddToCartDirect = (item: MenuItem) => {
    if (item.modifiers && item.modifiers.length > 0) {
      handleOpenModifierModal(item);
      return;
    }

    addItem({
      id: `${item.id}-${Date.now()}`,
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image || undefined,
    });
  };

  const handleAddWithModifiers = () => {
    if (!selectedItem) return;

    const modifierCost = selectedModifiers.reduce((acc, m) => acc + m.price, 0);
    const finalItemPrice = selectedItem.price + modifierCost;

    addItem({
      id: `${selectedItem.id}-${Date.now()}`,
      menuItemId: selectedItem.id,
      name: selectedItem.name,
      price: finalItemPrice,
      quantity: itemQuantity,
      image: selectedItem.image || undefined,
      modifiers: selectedModifiers.map(m => ({ name: m.name, price: m.price })),
      notes: itemNotes.trim() || undefined,
    });

    setSelectedItem(null);
  };

  const toggleModifier = (option: ModifierOption, group: ModifierGroup) => {
    const isAlreadySelected = selectedModifiers.some(m => m.id === option.id);

    if (isAlreadySelected) {
      setSelectedModifiers(selectedModifiers.filter(m => m.id !== option.id));
    } else {
      if (group.maxSelect === 1) {
        // Replace previous option in this group
        const groupOptionIds = group.options.map(o => o.id);
        const withoutCurrentGroup = selectedModifiers.filter(m => !groupOptionIds.includes(m.id));
        setSelectedModifiers([...withoutCurrentGroup, option]);
      } else {
        setSelectedModifiers([...selectedModifiers, option]);
      }
    }
  };

  const modalFinalPrice = selectedItem
    ? (selectedItem.price + selectedModifiers.reduce((acc, m) => acc + m.price, 0)) * itemQuantity
    : 0;

  return (
    <div className="relative min-h-screen pb-28 bg-slate-50">
      
      {/* ── Shop Hero Header ── */}
      <div className="bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-900 text-white px-5 py-8 text-center flex flex-col items-center justify-center relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-3 shadow-xl backdrop-blur-md">
          {state.shopData?.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={state.shopData.logo} alt="logo" className="w-full h-full rounded-2xl object-cover" />
          ) : (
            <Coffee className="w-8 h-8 text-amber-400" />
          )}
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">{state.shopData?.name || 'Café Noir'}</h2>
        {state.shopData?.tagline && (
          <p className="text-xs text-slate-300 mt-1 max-w-xs">{state.shopData.tagline}</p>
        )}
        
        {state.tableId && (
          <div className="mt-3.5 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Ordering for {state.tableNumber || `Table ${state.tableId}`}
          </div>
        )}
      </div>

      {/* ── Menu Loading Skeleton ── */}
      {loading ? (
        <div className="p-4 space-y-4 max-w-md mx-auto">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-4 p-4 bg-white rounded-2xl border animate-pulse">
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
                <div className="h-4 bg-slate-200 rounded w-1/4 mt-3" />
              </div>
              <div className="w-24 h-24 bg-slate-200 rounded-xl shrink-0" />
            </div>
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="p-12 text-center text-slate-500">
          <p className="text-4xl mb-2">🍽️</p>
          <p className="font-semibold">No menu items found</p>
          <p className="text-xs text-slate-400 mt-1">Please check back in a few minutes.</p>
        </div>
      ) : (
        <>
          {/* ── Sticky Category Navigation Pills ── */}
          <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
            <div className="flex overflow-x-auto px-4 py-3 gap-2 no-scrollbar max-w-md mx-auto">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    document.getElementById(`cat-${cat.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    activeCategory === cat.id
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.name} ({cat.items.length})
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 space-y-8 max-w-md mx-auto">
            
            {/* ── Featured Carousel ── */}
            {featuredItems.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-1.5">
                    ✨ Popular Favorites
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium">Bestsellers</span>
                </div>
                <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar -mx-4 px-4">
                  {featuredItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="min-w-[155px] max-w-[155px] border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white shrink-0 flex flex-col justify-between"
                    >
                      <div className="h-28 bg-gradient-to-br from-slate-100 to-indigo-50/50 w-full flex items-center justify-center relative">
                        {item.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-3xl">☕</span>
                        )}
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-md p-1 shadow-sm">
                          <div className={`w-2.5 h-2.5 rounded-full ${item.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        </div>
                      </div>
                      <div className="p-3 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{item.name}</h4>
                          <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{item.description}</p>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                          <span className="font-extrabold text-sm text-slate-900">₹{item.price}</span>
                          <button 
                            onClick={() => handleAddToCartDirect(item)} 
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm transition-colors"
                          >
                            + ADD
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── Categories & Item Cards ── */}
            {categories.map((cat) => (
              <section key={cat.id} id={`cat-${cat.id}`} className="scroll-mt-32 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <h3 className="font-extrabold text-lg text-slate-900">{cat.name}</h3>
                  <span className="text-xs text-slate-400 font-medium">{cat.items.length} items</span>
                </div>

                <div className="space-y-3">
                  {cat.items.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex gap-3.5 p-3.5 border border-slate-200/90 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                      {/* Left: Info */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 mb-1">
                            {/* Veg / Non-Veg Indicator */}
                            <div className={`w-3.5 h-3.5 rounded-sm border ${item.isVeg ? 'border-emerald-600 bg-emerald-50' : 'border-red-600 bg-red-50'} flex items-center justify-center shrink-0`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-emerald-600' : 'bg-red-600'}`} />
                            </div>
                            <h4 className="font-bold text-sm text-slate-900 leading-snug">{item.name}</h4>
                          </div>
                          {item.description && (
                            <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed mt-0.5">{item.description}</p>
                          )}
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                          <span className="font-extrabold text-base text-slate-900">₹{item.price}</span>
                          {item.modifiers && item.modifiers.length > 0 && (
                            <span className="text-[10px] text-indigo-600 bg-indigo-50 font-semibold px-2 py-0.5 rounded-full">
                              Customizable
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: Image & Add Button */}
                      <div className="flex flex-col items-center justify-between shrink-0">
                        <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-indigo-50 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-100">
                          {item.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-3xl">☕</span>
                          )}
                        </div>
                        <button 
                          onClick={() => handleAddToCartDirect(item)}
                          className="mt-2 w-full py-1.5 bg-white hover:bg-indigo-600 text-indigo-600 hover:text-white border border-indigo-600 font-bold rounded-xl text-xs shadow-sm transition-colors"
                        >
                          ADD
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </>
      )}

      {/* ── Modifier Selection Bottom Sheet / Modal ── */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl"
            >
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedItem.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Customize your beverage / item</p>
                  <p className="text-sm font-extrabold text-slate-900 mt-1">Base Price: ₹{selectedItem.price}</p>
                </div>
                <button 
                  onClick={() => setSelectedItem(null)} 
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modifier Groups */}
              {selectedItem.modifiers?.map((group) => (
                <div key={group.id} className="space-y-2.5">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">{group.name}</h4>
                    <span className="text-[11px] text-slate-400">
                      {group.maxSelect === 1 ? 'Select 1' : `Max ${group.maxSelect}`}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {group.options.map((opt) => {
                      const isSelected = selectedModifiers.some(m => m.id === opt.id);
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => toggleModifier(opt, group)}
                          className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all ${
                            isSelected 
                              ? 'border-indigo-600 bg-indigo-50/60 text-indigo-900' 
                              : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-${group.maxSelect === 1 ? 'full' : 'md'} border flex items-center justify-center ${isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'}`}>
                              {isSelected && <Check size={12} />}
                            </div>
                            <span>{opt.name}</span>
                          </div>
                          <span className="font-bold text-slate-900">+₹{opt.price}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Custom Instructions */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-slate-700">Special Instructions / Cooking Notes</label>
                <input 
                  type="text" 
                  placeholder="e.g. Less sweet, extra hot, no foam" 
                  value={itemNotes} 
                  onChange={e => setItemNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Quantity & Confirm Button */}
              <div className="pt-4 border-t flex items-center gap-3">
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                  <button 
                    onClick={() => setItemQuantity(Math.max(1, itemQuantity - 1))}
                    className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-700 shadow-sm"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-bold text-sm">{itemQuantity}</span>
                  <button 
                    onClick={() => setItemQuantity(itemQuantity + 1)}
                    className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-700 shadow-sm"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  onClick={handleAddWithModifiers}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-between shadow-lg shadow-indigo-600/25 transition-colors"
                >
                  <span>Add to Order</span>
                  <span>₹{modalFinalPrice}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Sticky Bottom View Cart Floating Bar ── */}
      <AnimatePresence>
        {state.totalItems > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-4 left-0 right-0 px-4 z-50 flex justify-center"
          >
            <Link 
              href={`/shop/${slug}/checkout`}
              className="w-full max-w-md bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between font-bold text-sm transition-all"
            >
              <div className="flex flex-col">
                <span className="text-xs opacity-90">{state.totalItems} ITEM{state.totalItems > 1 ? 'S' : ''} ADDED</span>
                <span className="text-lg font-extrabold">₹{state.subtotal}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-3.5 py-1.5 rounded-xl">
                View Cart <Plus size={18} />
              </div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
