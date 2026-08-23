"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
    Coffee,
    CheckCircle2,
    Clock,
    ChefHat,
    ShoppingBag,
    Sparkles,
    Star,
    Gift,
    Award,
    Receipt,
    Share2,
    ThumbsUp,
    Heart,
    ArrowLeft
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { celebrationConfetti, fireConfetti } from "@/lib/confetti"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export default function OrderStatusPage() {
    const params = useParams()
    const orderId = params.orderId as string

    const [order, setOrder] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [rating, setRating] = useState(0)
    const [tip, setTip] = useState(0)
    const [scratched, setScratched] = useState(false)
    const [bonusPoints, setBonusPoints] = useState(0)

    useEffect(() => {
        if (orderId) {
            fetchOrder()
            const interval = setInterval(fetchOrder, 4000)
            return () => clearInterval(interval)
        }
    }, [orderId])

    const fetchOrder = async () => {
        try {
            const res = await fetch(`${API_URL}/orders/${orderId}`)
            if (res.ok) {
                const data = await res.json()
                setOrder(data)
            } else {
                // Demo fallback order if backend not seeded with this specific ID
                setOrder({
                    id: orderId,
                    shortId: orderId.slice(0, 6).toUpperCase(),
                    status: "PREPARING",
                    totalAmount: 420,
                    tableNumber: "T-4",
                    createdAt: new Date().toISOString(),
                    items: [
                        { menuItem: { name: "Cappuccino", price: 200 }, quantity: 1 },
                        { menuItem: { name: "Croissant", price: 120 }, quantity: 1 },
                        { menuItem: { name: "Blueberry Muffin", price: 100 }, quantity: 1 }
                    ],
                    shop: { name: "Café Noir", address: "123 Coffee Street, Indiranagar, Bangalore" }
                })
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleScratch = () => {
        if (scratched) return
        const won = Math.floor(Math.random() * 50) + 20
        setBonusPoints(won)
        setScratched(true)
        celebrationConfetti()
        toast.success(`🎉 You won ${won} Bonus Loyalty Points!`)
    }

    const handleRating = (stars: number) => {
        setRating(stars)
        fireConfetti()
        toast.success(`Thank you for rating us ${stars} stars! ⭐`)
    }

    const stages = [
        { key: "PENDING", label: "Placed", icon: ShoppingBag, desc: "Order sent to kitchen" },
        { key: "CONFIRMED", label: "Accepted", icon: CheckCircle2, desc: "Chef confirmed your order" },
        { key: "PREPARING", label: "Preparing", icon: ChefHat, desc: "Crafting your order with care" },
        { key: "READY", label: "Ready", icon: Coffee, desc: "Ready for pickup / serving" },
        { key: "COMPLETED", label: "Served", icon: Award, desc: "Enjoy your meal!" }
    ]

    const getCurrentStageIndex = (status: string) => {
        const idx = stages.findIndex(s => s.key === status)
        return idx >= 0 ? idx : 2 // Default to preparing for demo
    }

    const activeIndex = getCurrentStageIndex(order?.status || "PREPARING")

    return (
        <div className="min-h-screen bg-stone-950 text-white font-sans pb-16">
            {/* Header */}
            <header className="px-6 py-4 border-b border-stone-800 bg-stone-900/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 text-stone-400 hover:text-white transition">
                    <ArrowLeft className="w-5 h-5" />
                    <span className="text-sm font-medium">Home</span>
                </Link>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                        ☕
                    </div>
                    <span className="font-bold tracking-tight text-white">{order?.shop?.name || "Café Noir"}</span>
                </div>
                <div className="text-xs bg-stone-800 text-stone-300 px-3 py-1 rounded-full font-mono">
                    Table {order?.tableNumber || "T-4"}
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-6 pt-8 space-y-8">
                {/* Hero Status Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative p-8 rounded-3xl bg-gradient-to-br from-amber-500/10 via-stone-900 to-stone-900 border border-amber-500/30 text-center overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                    <motion.div
                        animate={{ scale: [1, 1.08, 1] }}
                        transition={{ repeat: Infinity, duration: 2.5 }}
                        className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-xl shadow-orange-500/20"
                    >
                        <ChefHat className="w-10 h-10" />
                    </motion.div>

                    <h1 className="text-3xl font-bold mb-2">Order #{order?.shortId || "CN-8842"}</h1>
                    <p className="text-amber-400 font-medium text-lg mb-6">
                        {stages[activeIndex]?.desc || "Preparing your coffee..."}
                    </p>

                    {/* Progress Bar */}
                    <div className="relative flex items-center justify-between max-w-md mx-auto">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-stone-800 -z-0" />
                        <div
                            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-700 -z-0"
                            style={{ width: `${(activeIndex / (stages.length - 1)) * 100}%` }}
                        />

                        {stages.map((stage, idx) => {
                            const Icon = stage.icon
                            const isDone = idx <= activeIndex
                            const isCurrent = idx === activeIndex

                            return (
                                <div key={stage.key} className="relative z-10 flex flex-col items-center">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isCurrent
                                                ? "bg-amber-500 text-stone-950 ring-4 ring-amber-500/30 scale-110 shadow-lg"
                                                : isDone
                                                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                                                    : "bg-stone-800 text-stone-500 border border-stone-700"
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <span
                                        className={`text-xs mt-2 font-medium ${isCurrent ? "text-amber-400" : isDone ? "text-white/80" : "text-stone-500"
                                            }`}
                                    >
                                        {stage.label}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </motion.div>

                {/* Digital Receipt Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 rounded-2xl bg-stone-900 border border-stone-800"
                >
                    <div className="flex items-center justify-between border-b border-stone-800 pb-4 mb-4">
                        <div className="flex items-center gap-3">
                            <Receipt className="w-5 h-5 text-amber-400" />
                            <h2 className="font-bold text-lg">Digital Receipt</h2>
                        </div>
                        <span className="text-xs text-emerald-400 font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            PAID • UPI QR
                        </span>
                    </div>

                    <div className="space-y-3 mb-6 text-sm">
                        {order?.items?.map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center text-stone-300">
                                <span>{item.quantity}x {item.menuItem?.name || item.name}</span>
                                <span className="font-mono text-stone-200">₹{(item.menuItem?.price || item.price || 150) * item.quantity}</span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-dashed border-stone-800 pt-4 flex justify-between items-center text-lg font-bold">
                        <span>Total Paid</span>
                        <span className="text-amber-400 font-mono">₹{order?.totalAmount || 420}</span>
                    </div>
                </motion.div>

                {/* Customer Gamified Loyalty Reward Scratch Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 rounded-3xl bg-gradient-to-r from-purple-900/30 via-pink-900/20 to-stone-900 border border-purple-500/30 text-center relative overflow-hidden"
                >
                    <div className="flex items-center justify-center gap-2 text-purple-400 font-medium text-sm mb-2">
                        <Sparkles className="w-4 h-4" />
                        <span>Loyalty Reward Unlock</span>
                    </div>
                    <h3 className="text-xl font-bold mb-4">Tap to Claim Bonus Points!</h3>

                    {!scratched ? (
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={handleScratch}
                            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 font-bold text-white shadow-xl shadow-purple-500/25 flex items-center justify-center gap-3 mx-auto"
                        >
                            <Gift className="w-6 h-6 animate-bounce" />
                            Scratch Rewards Card
                        </motion.button>
                    ) : (
                        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="p-4 bg-purple-950/60 rounded-2xl border border-purple-500/40">
                            <p className="text-purple-300 text-sm">Reward Unlocked!</p>
                            <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-400 my-1">
                                +{bonusPoints} Points Credited
                            </div>
                            <p className="text-xs text-stone-400">Linked to mobile number ending in ****842</p>
                        </motion.div>
                    )}
                </motion.div>

                {/* Rate Your Experience & Tip Chef */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-6 rounded-2xl bg-stone-900 border border-stone-800 text-center"
                >
                    <h3 className="font-bold text-lg mb-2">Rate Your Experience</h3>
                    <p className="text-xs text-stone-400 mb-4">How was your visit at Café Noir today?</p>

                    <div className="flex justify-center gap-3 mb-6">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => handleRating(star)}
                                className="p-2 transition-transform hover:scale-125 focus:outline-none"
                            >
                                <Star
                                    className={`w-8 h-8 ${star <= rating
                                            ? "fill-amber-400 text-amber-400"
                                            : "text-stone-700 hover:text-amber-300"
                                        }`}
                                />
                            </button>
                        ))}
                    </div>

                    {/* Tip Chef Buttons */}
                    <div className="pt-4 border-t border-stone-800">
                        <p className="text-xs text-stone-400 mb-3">Leave a tip for your barista & kitchen staff</p>
                        <div className="flex justify-center gap-3">
                            {[10, 20, 50, 100].map((amt) => (
                                <button
                                    key={amt}
                                    onClick={() => {
                                        setTip(amt)
                                        toast.success(`₹${amt} tip added! Thank you for supporting our team ❤️`)
                                    }}
                                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${tip === amt
                                            ? "bg-amber-500 text-stone-950 font-bold"
                                            : "bg-stone-800 text-stone-300 hover:bg-stone-700"
                                        }`}
                                >
                                    +₹{amt}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    )
}
