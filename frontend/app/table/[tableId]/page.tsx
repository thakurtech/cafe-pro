"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, ShoppingBag, UtensilsCrossed, Coffee, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { createOrder } from "@/lib/api"
import { toast } from "sonner"

interface MenuItem {
    id: string
    name: string
    description?: string
    price: number
    image?: string
    isAvailable: boolean
}

interface MenuCategory {
    id: string
    name: string
    items: MenuItem[]
}

export default function TableOrderPage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const tableId = params.tableId as string
    const shopSlug = searchParams.get('shop') || ''

    const [categories, setCategories] = useState<MenuCategory[]>([])
    const [loading, setLoading] = useState(true)
    const [shopName, setShopName] = useState('Café')
    const [shopId, setShopId] = useState('')
    const [cart, setCart] = useState<{ id: string, qty: number }[]>([])
    const [isCartOpen, setIsCartOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (shopSlug) {
            fetchShopAndMenu()
        } else {
            setLoading(false)
        }
    }, [shopSlug])

    const fetchShopAndMenu = async () => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

            // Fetch shop details and menu
            const shopRes = await fetch(`${API_URL}/shops/${shopSlug}`)
            if (shopRes.ok) {
                const shop = await shopRes.json()
                setShopName(shop.name)
                setShopId(shop.id)

                // Menu categories come with the shop
                if (shop.menuCategories) {
                    setCategories(shop.menuCategories)
                }
            }
        } catch (error) {
            console.error('Failed to fetch shop/menu:', error)
        } finally {
            setLoading(false)
        }
    }

    const addToCart = (id: string) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === id)
            if (existing) {
                return prev.map(item => item.id === id ? { ...item, qty: item.qty + 1 } : item)
            }
            return [...prev, { id, qty: 1 }]
        })
    }

    const allItems = categories.flatMap(c => c.items)
    const totalItems = cart.reduce((acc, item) => acc + item.qty, 0)
    const totalPrice = cart.reduce((acc, item) => {
        const product = allItems.find(p => p.id === item.id)
        return acc + (product?.price || 0) * item.qty
    }, 0)

    const handlePlaceOrder = async () => {
        if (cart.length === 0 || !shopId) return

        setIsSubmitting(true)
        try {
            const newOrder = await createOrder({
                shopId,
                items: cart.map(c => ({ menuItemId: c.id, quantity: c.qty })),
                source: 'QR_TABLE',
                tableNumber: tableId
            })

            toast.success('Order placed successfully!')
            setCart([])
            setIsCartOpen(false)

            if (newOrder?.id) {
                setTimeout(() => {
                    window.location.href = `/order-status/${newOrder.id}`;
                }, 1000);
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to place order')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8f5f2] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#BF5700]" />
            </div>
        )
    }

    if (!shopSlug) {
        return (
            <div className="min-h-screen bg-[#f8f5f2] flex items-center justify-center p-6">
                <div className="text-center">
                    <Coffee className="w-12 h-12 mx-auto mb-4 text-[#BF5700]" />
                    <h1 className="text-xl font-bold text-[#2B1A12] mb-2">Invalid QR Code</h1>
                    <p className="text-[#8B4513]">Please scan a valid table QR code</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#f8f5f2] pb-24">
            {/* Header */}
            <div className="bg-white p-4 sticky top-0 z-10 shadow-sm border-b border-[#e6dcc8]">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="font-serif font-bold text-xl text-[#2B1A12]">{shopName}</h1>
                        <p className="text-xs text-[#8B4513]">Table {tableId} • Dine-in</p>
                    </div>
                    <div className="w-10 h-10 bg-[#BF5700]/10 rounded-full flex items-center justify-center">
                        <UtensilsCrossed className="w-5 h-5 text-[#BF5700]" />
                    </div>
                </div>
            </div>

            {/* Menu Categories */}
            {categories.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500 p-6">
                    <Coffee className="w-12 h-12 mb-4 opacity-50" />
                    <p>No menu items available</p>
                </div>
            ) : (
                <Tabs defaultValue={categories[0]?.id} className="w-full">
                    <div className="sticky top-[73px] z-10 bg-[#f8f5f2] pt-2 pb-2 px-4 overflow-x-auto">
                        <TabsList className="h-10 bg-white border border-[#e6dcc8]">
                            {categories.map(cat => (
                                <TabsTrigger
                                    key={cat.id}
                                    value={cat.id}
                                    className="data-[state=active]:bg-[#BF5700] data-[state=active]:text-white"
                                >
                                    {cat.name}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>

                    {categories.map(cat => (
                        <TabsContent key={cat.id} value={cat.id} className="px-4 mt-2 space-y-4">
                            {cat.items.filter(item => item.isAvailable).map(item => (
                                <div key={item.id} className="bg-white p-3 rounded-xl border border-[#e6dcc8] flex gap-4 shadow-sm">
                                    <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                        <img
                                            src={item.image || `https://placehold.co/400x300/f5ede4/5c3d2e?text=${encodeURIComponent(item.name)}`}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-bold text-[#2B1A12]">{item.name}</h3>
                                            {item.description && (
                                                <p className="text-xs text-[#8B4513] line-clamp-2">{item.description}</p>
                                            )}
                                            <p className="text-[#BF5700] font-bold">₹{item.price}</p>
                                        </div>
                                        <Button
                                            size="sm"
                                            className="self-end bg-[#fffcf8] border border-[#BF5700] text-[#BF5700] hover:bg-[#BF5700] hover:text-white"
                                            onClick={() => addToCart(item.id)}
                                        >
                                            <Plus className="w-4 h-4 mr-1" /> Add
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </TabsContent>
                    ))}
                </Tabs>
            )}

            {/* Floating Cart Button */}
            <AnimatePresence>
                {totalItems > 0 && (
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        className="fixed bottom-6 left-4 right-4 z-20"
                    >
                        <Button
                            className="w-full h-14 bg-[#2B1A12] text-white shadow-xl rounded-xl flex justify-between items-center px-6 text-lg"
                            onClick={() => setIsCartOpen(true)}
                        >
                            <div className="flex items-center gap-3">
                                <div className="bg-[#BF5700] w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                                    {totalItems}
                                </div>
                                <span>View Order</span>
                            </div>
                            <span className="font-bold">₹{totalPrice}</span>
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Cart Sheet */}
            {isCartOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-end">
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        className="bg-white w-full rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-serif font-bold text-[#2B1A12]">Your Order</h2>
                            <Button variant="ghost" onClick={() => setIsCartOpen(false)}>Close</Button>
                        </div>

                        <div className="space-y-4 mb-8">
                            {cart.map(cartItem => {
                                const item = allItems.find(i => i.id === cartItem.id)
                                return (
                                    <div key={cartItem.id} className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-[#BF5700]">{cartItem.qty}x</span>
                                            <span>{item?.name}</span>
                                        </div>
                                        <span>₹{(item?.price || 0) * cartItem.qty}</span>
                                    </div>
                                )
                            })}
                            <div className="border-t border-dashed border-gray-300 pt-4 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>₹{totalPrice}</span>
                            </div>
                        </div>

                        <Button
                            className="w-full h-14 bg-[#BF5700] hover:bg-[#8B4513] text-white text-lg rounded-xl font-bold"
                            onClick={handlePlaceOrder}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>Place Order <ShoppingBag className="ml-2 w-5 h-5" /></>
                            )}
                        </Button>
                    </motion.div>
                </div>
            )}
        </div>
    )
}
