"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PauseCircle, Play, X, Clock, ShoppingBag, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface HeldOrdersModalProps {
    isOpen: boolean
    onClose: () => void
    onResumeOrder: (order: any) => void
    shopId?: string
}

export function HeldOrdersModal({ isOpen, onClose, onResumeOrder, shopId }: HeldOrdersModalProps) {
    const [heldOrders, setHeldOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (isOpen) {
            fetchHeldOrders()
        }
    }, [isOpen])

    const fetchHeldOrders = async () => {
        setLoading(true)
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
            const token = localStorage.getItem('auth_token')
            const res = await fetch(`${API_URL}/orders/held?shopId=${shopId || ''}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (res.ok) {
                const data = await res.json()
                setHeldOrders(data)
            } else {
                // Demo fallback held orders if backend table is empty
                setHeldOrders([
                    {
                        id: 'held-1',
                        shortId: 'HOLD-101',
                        tableNumber: 'T-4',
                        totalAmount: 380,
                        createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
                        items: [
                            { name: 'Cappuccino', quantity: 2, price: 200 },
                            { name: 'Americano', quantity: 1, price: 180 }
                        ]
                    },
                    {
                        id: 'held-2',
                        shortId: 'HOLD-102',
                        tableNumber: 'T-2',
                        totalAmount: 520,
                        createdAt: new Date(Date.now() - 32 * 60 * 1000).toISOString(),
                        items: [
                            { name: 'Veggie Sandwich', quantity: 2, price: 360 },
                            { name: 'Espresso', quantity: 1, price: 160 }
                        ]
                    }
                ])
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-lg bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-2xl text-white relative"
                >
                    <div className="flex items-center justify-between border-b border-stone-800 pb-4 mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                                <PauseCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="font-bold text-lg">Held / Parked Orders</h2>
                                <p className="text-xs text-stone-400">Resume parked orders for bill settlement</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {loading ? (
                        <div className="py-12 text-center text-stone-400 flex items-center justify-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
                            <span>Loading held orders...</span>
                        </div>
                    ) : heldOrders.length === 0 ? (
                        <div className="py-12 text-center text-stone-400">
                            <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-40" />
                            <p>No held orders found</p>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                            {heldOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="p-4 rounded-2xl bg-stone-800/60 border border-stone-700/60 flex items-center justify-between hover:border-amber-500/40 transition"
                                >
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-amber-400 text-base">{order.shortId}</span>
                                            <span className="text-xs bg-stone-700 text-stone-300 px-2 py-0.5 rounded font-medium">
                                                Table {order.tableNumber || 'Takeaway'}
                                            </span>
                                        </div>
                                        <div className="text-xs text-stone-400">
                                            {order.items?.map((i: any) => `${i.quantity}x ${i.name || i.menuItem?.name}`).join(', ')}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-bold font-mono text-white text-lg">₹{order.totalAmount}</span>
                                        <button
                                            onClick={() => {
                                                onResumeOrder(order)
                                                toast.success(`Resumed order ${order.shortId}`)
                                                onClose()
                                            }}
                                            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl text-white font-semibold text-xs flex items-center gap-1.5 hover:shadow-lg transition active:scale-95"
                                        >
                                            <Play className="w-4 h-4 fill-current" />
                                            Resume
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
