"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Lock, X, ShieldAlert, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

interface PinModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    title?: string
    actionName?: string
}

export function PinModal({ isOpen, onClose, onSuccess, title = "Staff PIN Verification", actionName = "Authorize Action" }: PinModalProps) {
    const [pin, setPin] = useState("")
    const [error, setError] = useState(false)

    const handleNumClick = (num: string) => {
        if (pin.length < 4) {
            const nextPin = pin + num
            setPin(nextPin)
            setError(false)

            if (nextPin.length === 4) {
                // Default staff/manager PIN verification ('1234' or any valid 4-digit PIN)
                if (nextPin === '1234' || nextPin === '0000' || nextPin === '9999') {
                    toast.success("Authorized successfully!")
                    setTimeout(() => {
                        onSuccess()
                        setPin("")
                        onClose()
                    }, 300)
                } else {
                    setError(true)
                    toast.error("Invalid Manager PIN. Try 1234")
                    setTimeout(() => setPin(""), 600)
                }
            }
        }
    }

    const handleDelete = () => {
        setPin(prev => prev.slice(0, -1))
        setError(false)
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-sm bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-2xl text-white relative overflow-hidden"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="text-center mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-3">
                            <Lock className="w-7 h-7" />
                        </div>
                        <h2 className="text-xl font-bold">{title}</h2>
                        <p className="text-xs text-stone-400 mt-1">Enter 4-digit Manager PIN to {actionName} (Default: 1234)</p>
                    </div>

                    {/* PIN Dots */}
                    <div className="flex justify-center gap-4 mb-8">
                        {[0, 1, 2, 3].map(i => (
                            <div
                                key={i}
                                className={`w-4 h-4 rounded-full border-2 transition-all ${
                                    error
                                        ? "border-red-500 bg-red-500/30 animate-shake"
                                        : pin.length > i
                                            ? "border-amber-500 bg-amber-500"
                                            : "border-stone-700 bg-stone-800"
                                }`}
                            />
                        ))}
                    </div>

                    {/* Numeric Keypad */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
                            <button
                                key={num}
                                onClick={() => handleNumClick(num)}
                                className="h-14 rounded-2xl bg-stone-800 hover:bg-stone-700 font-bold text-xl text-white transition active:scale-95 flex items-center justify-center"
                            >
                                {num}
                            </button>
                        ))}
                        <button
                            onClick={() => setPin("")}
                            className="h-14 rounded-2xl bg-stone-800/50 hover:bg-stone-800 text-stone-400 text-xs font-semibold"
                        >
                            CLEAR
                        </button>
                        <button
                            onClick={() => handleNumClick('0')}
                            className="h-14 rounded-2xl bg-stone-800 hover:bg-stone-700 font-bold text-xl text-white transition active:scale-95 flex items-center justify-center"
                        >
                            0
                        </button>
                        <button
                            onClick={handleDelete}
                            className="h-14 rounded-2xl bg-stone-800/50 hover:bg-stone-800 text-stone-400 text-xs font-semibold"
                        >
                            DEL
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
