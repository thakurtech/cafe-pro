'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Plus, Minus, ShoppingBag, X, ChevronDown, ChevronUp, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface MenuItem {
    id: string;
    name: string;
    description?: string;
    price: number;
    image?: string;
    isAvailable: boolean;
}

interface MenuCategory {
    id: string;
    name: string;
    items: MenuItem[];
}

interface Shop {
    id: string;
    name: string;
    slug: string;
    logo?: string;
    themeColor: string;
    tagline?: string;
    address?: string;
}

interface CartItem {
    item: MenuItem;
    quantity: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function PublicMenuPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const shopSlug = params.slug as string;
    const tableNumber = searchParams.get('table');

    const [shop, setShop] = useState<Shop | null>(null);
    const [categories, setCategories] = useState<MenuCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [showCart, setShowCart] = useState(false);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

    // Fetch shop and menu data
    useEffect(() => {
        async function fetchMenu() {
            try {
                const res = await fetch(`${API_URL}/shops/${shopSlug}`);
                if (!res.ok) throw new Error('Shop not found');

                const data = await res.json();
                setShop(data);
                setCategories(data.menuCategories || []);

                // Expand first category by default
                if (data.menuCategories?.length > 0) {
                    setExpandedCategory(data.menuCategories[0].id);
                }
            } catch (error) {
                console.error('Failed to fetch menu:', error);
                toast.error('Failed to load menu');
            } finally {
                setLoading(false);
            }
        }

        if (shopSlug) {
            fetchMenu();
        }
    }, [shopSlug]);

    const addToCart = (item: MenuItem) => {
        setCart(prev => {
            const existing = prev.find(c => c.item.id === item.id);
            if (existing) {
                return prev.map(c =>
                    c.item.id === item.id
                        ? { ...c, quantity: c.quantity + 1 }
                        : c
                );
            }
            return [...prev, { item, quantity: 1 }];
        });
        toast.success(`Added ${item.name}`);
    };

    const updateQuantity = (itemId: string, delta: number) => {
        setCart(prev => {
            return prev.map(c => {
                if (c.item.id === itemId) {
                    const newQty = c.quantity + delta;
                    return newQty > 0 ? { ...c, quantity: newQty } : c;
                }
                return c;
            }).filter(c => c.quantity > 0);
        });
    };

    const removeFromCart = (itemId: string) => {
        setCart(prev => prev.filter(c => c.item.id !== itemId));
    };

    const cartTotal = cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0);
    const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0);

    const submitOrder = async () => {
        if (!shop) return;
        if (cart.length === 0) {
            toast.error('Your cart is empty');
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    shopId: shop.id,
                    source: tableNumber ? 'QR_TABLE' : 'QR_PICKUP',
                    tableNumber,
                    notes: customerName ? `Customer: ${customerName}` : undefined,
                    paymentMethod: 'CASH', // Default to cash for QR orders
                    items: cart.map(c => ({
                        menuItemId: c.item.id,
                        quantity: c.quantity,
                    })),
                }),
            });

            if (!res.ok) throw new Error('Failed to submit order');

            const order = await res.json();

            setCart([]);
            setShowCart(false);
            toast.success(`Order ${order.shortId} placed successfully!`);

            // Redirect customer to live order status & digital receipt page
            setTimeout(() => {
                window.location.href = `/order-status/${order.id}`;
            }, 1200);

        } catch (error) {
            console.error('Order submission failed:', error);
            toast.error('Failed to place order. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#fef9f3] to-white flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-[#BF5700] mx-auto mb-4" />
                    <p className="text-[#5C4033]">Loading menu...</p>
                </div>
            </div>
        );
    }

    if (!shop) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#fef9f3] to-white flex items-center justify-center p-4">
                <div className="text-center">
                    <Coffee className="w-16 h-16 text-[#e8dfd6] mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-[#2B1A12] mb-2">Cafe Not Found</h1>
                    <p className="text-[#5C4033]">This menu link may be invalid or expired.</p>
                </div>
            </div>
        );
    }

    const themeColor = shop.themeColor || '#BF5700';

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#fef9f3] to-white pb-24">
            {/* Header */}
            <div
                className="sticky top-0 z-40 backdrop-blur-md border-b border-white/20"
                style={{ backgroundColor: `${themeColor}e6` }}
            >
                <div className="max-w-lg mx-auto p-4 text-white">
                    <div className="flex items-center gap-3">
                        {shop.logo ? (
                            <img src={shop.logo} alt={shop.name} className="w-12 h-12 rounded-xl object-cover" />
                        ) : (
                            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                                <Coffee className="w-6 h-6" />
                            </div>
                        )}
                        <div>
                            <h1 className="font-bold text-xl">{shop.name}</h1>
                            {shop.tagline && <p className="text-white/80 text-sm">{shop.tagline}</p>}
                        </div>
                    </div>
                    {tableNumber && (
                        <div className="mt-3 bg-white/20 rounded-lg px-3 py-2 text-sm">
                            📍 Table {tableNumber}
                        </div>
                    )}
                </div>
            </div>

            {/* Menu Categories */}
            <div className="max-w-lg mx-auto p-4 space-y-4">
                {categories.map(category => (
                    <div key={category.id} className="bg-white rounded-2xl border-2 border-[#e8dfd6] overflow-hidden">
                        <button
                            onClick={() => setExpandedCategory(
                                expandedCategory === category.id ? null : category.id
                            )}
                            className="w-full flex items-center justify-between p-4 hover:bg-[#fef9f3] transition-colors"
                        >
                            <h2 className="font-bold text-lg text-[#2B1A12]">{category.name}</h2>
                            {expandedCategory === category.id ? (
                                <ChevronUp className="w-5 h-5 text-[#5C4033]" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-[#5C4033]" />
                            )}
                        </button>

                        <AnimatePresence>
                            {expandedCategory === category.id && (
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: 'auto' }}
                                    exit={{ height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="border-t border-[#e8dfd6] divide-y divide-[#e8dfd6]">
                                        {category.items.filter(item => item.isAvailable).map(item => (
                                            <div key={item.id} className="p-4 flex gap-4">
                                                {item.image && (
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-20 h-20 rounded-xl object-cover shrink-0"
                                                    />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-[#2B1A12]">{item.name}</h3>
                                                    {item.description && (
                                                        <p className="text-sm text-[#5C4033] line-clamp-2 mt-1">
                                                            {item.description}
                                                        </p>
                                                    )}
                                                    <div className="flex items-center justify-between mt-2">
                                                        <span className="font-bold" style={{ color: themeColor }}>
                                                            ₹{item.price}
                                                        </span>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => addToCart(item)}
                                                            className="rounded-full h-8 px-4"
                                                            style={{ backgroundColor: themeColor }}
                                                        >
                                                            <Plus className="w-4 h-4 mr-1" />
                                                            Add
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>

            {/* Cart FAB */}
            {cartCount > 0 && (
                <button
                    onClick={() => setShowCart(true)}
                    className="fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-xl flex items-center justify-center text-white z-50"
                    style={{ backgroundColor: themeColor }}
                >
                    <ShoppingBag className="w-6 h-6" />
                    <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white text-sm font-bold flex items-center justify-center"
                        style={{ color: themeColor }}
                    >
                        {cartCount}
                    </span>
                </button>
            )}

            {/* Cart Sheet */}
            <AnimatePresence>
                {showCart && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50"
                        onClick={() => setShowCart(false)}
                    >
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[80vh] overflow-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="sticky top-0 bg-white p-4 border-b border-[#e8dfd6] flex items-center justify-between">
                                <h2 className="font-bold text-xl text-[#2B1A12]">Your Order</h2>
                                <button onClick={() => setShowCart(false)} className="p-2">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-4 space-y-4">
                                {cart.map(c => (
                                    <div key={c.item.id} className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-[#2B1A12]">{c.item.name}</h3>
                                            <p style={{ color: themeColor }}>₹{c.item.price * c.quantity}</p>
                                        </div>
                                        <div className="flex items-center gap-2 bg-[#fef9f3] rounded-lg p-1">
                                            <button
                                                onClick={() => updateQuantity(c.item.id, -1)}
                                                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-6 text-center font-bold">{c.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(c.item.id, 1)}
                                                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(c.item.id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}

                                {/* Customer Details */}
                                <div className="pt-4 border-t border-[#e8dfd6] space-y-3">
                                    <Input
                                        placeholder="Your name (optional)"
                                        value={customerName}
                                        onChange={e => setCustomerName(e.target.value)}
                                        className="rounded-xl"
                                    />
                                    <Input
                                        placeholder="Phone number (optional)"
                                        value={customerPhone}
                                        onChange={e => setCustomerPhone(e.target.value)}
                                        className="rounded-xl"
                                    />
                                </div>

                                {/* Total */}
                                <div className="pt-4 border-t border-[#e8dfd6]">
                                    <div className="flex justify-between text-xl font-bold">
                                        <span>Total</span>
                                        <span style={{ color: themeColor }}>₹{cartTotal}</span>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <Button
                                    onClick={submitOrder}
                                    disabled={isSubmitting || cart.length === 0}
                                    className="w-full h-14 text-lg font-bold rounded-xl"
                                    style={{ backgroundColor: themeColor }}
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5 mr-2" />
                                            Place Order
                                        </>
                                    )}
                                </Button>

                                <p className="text-center text-sm text-[#5C4033]">
                                    Pay at counter after your order is ready
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
