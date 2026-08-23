"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Layers, Plus, Trash2, CheckCircle2, Coffee, Sparkles } from "lucide-react"
import { toast } from "sonner"

export function RecipeBuilder() {
    const [selectedItem, setSelectedItem] = useState("cappuccino")
    const [recipe, setRecipe] = useState([
        { ingredientId: "1", name: "Espresso Beans", quantity: 18, unit: "g", cost: 22 },
        { ingredientId: "2", name: "Whole Milk", quantity: 150, unit: "ml", cost: 12 }
    ])

    const availableIngredients = [
        { id: "1", name: "Espresso Beans", unit: "g", costPerUnit: 1.2 },
        { id: "2", name: "Whole Milk", unit: "ml", costPerUnit: 0.08 },
        { id: "3", name: "Oat Milk", unit: "ml", costPerUnit: 0.25 },
        { id: "4", name: "Chocolate Syrup", unit: "ml", costPerUnit: 0.3 },
        { id: "5", name: "Sugar Syrup", unit: "ml", costPerUnit: 0.05 }
    ]

    const handleAddIngredient = () => {
        const item = availableIngredients[0]
        setRecipe(prev => [...prev, { ingredientId: item.id, name: item.name, quantity: 10, unit: item.unit, cost: 12 }])
    }

    const handleRemoveIngredient = (idx: number) => {
        setRecipe(prev => prev.filter((_, i) => i !== idx))
    }

    const totalRecipeCost = recipe.reduce((sum, r) => sum + r.cost, 0)
    const menuItemPrice = 200
    const profitMargin = (((menuItemPrice - totalRecipeCost) / menuItemPrice) * 100).toFixed(1)

    const handleSaveRecipe = () => {
        toast.success(`Recipe saved for Cappuccino! Cost per serving: ₹${totalRecipeCost}`)
    }

    return (
        <div className="p-6 bg-stone-900 border border-stone-800 rounded-3xl text-white space-y-6">
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/20">
                        <Layers className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Recipe Component Engine</h2>
                        <p className="text-xs text-stone-400">Map menu items to raw ingredients for automated stock deduction</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <span className="text-xs text-stone-400 block">Food Cost %</span>
                        <span className="text-lg font-bold font-mono text-emerald-400">{profitMargin}% Margin</span>
                    </div>
                    <button
                        onClick={handleSaveRecipe}
                        className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl font-bold text-sm text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition flex items-center gap-2"
                    >
                        <CheckCircle2 className="w-4 h-4" />
                        Save Recipe
                    </button>
                </div>
            </div>

            {/* Menu Item Selector */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                    <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-2">Select Menu Item</label>
                    <select
                        value={selectedItem}
                        onChange={(e) => setSelectedItem(e.target.value)}
                        className="w-full p-3 rounded-xl bg-stone-800 border border-stone-700 text-white font-medium focus:outline-none focus:border-amber-500"
                    >
                        <option value="cappuccino">Cappuccino (₹200)</option>
                        <option value="latte">Latte (₹220)</option>
                        <option value="espresso">Espresso (₹150)</option>
                        <option value="sandwich">Veggie Sandwich (₹180)</option>
                    </select>
                </div>

                <div className="md:col-span-2 p-4 bg-stone-800/40 border border-stone-800 rounded-2xl flex items-center justify-between">
                    <div>
                        <span className="text-xs text-stone-400">Estimated Cost of Ingredients</span>
                        <div className="text-2xl font-bold font-mono text-amber-400">₹{totalRecipeCost.toFixed(2)}</div>
                    </div>
                    <div>
                        <span className="text-xs text-stone-400">Selling Price</span>
                        <div className="text-2xl font-bold font-mono text-white">₹{menuItemPrice}</div>
                    </div>
                    <div>
                        <span className="text-xs text-stone-400">Gross Profit / Cup</span>
                        <div className="text-2xl font-bold font-mono text-emerald-400">₹{(menuItemPrice - totalRecipeCost).toFixed(2)}</div>
                    </div>
                </div>
            </div>

            {/* Ingredient List Builder */}
            <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-stone-400 uppercase tracking-wider">
                    <span>Component Ingredients</span>
                    <button
                        onClick={handleAddIngredient}
                        className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-bold lowercase tracking-normal"
                    >
                        <Plus className="w-4 h-4" /> Add ingredient
                    </button>
                </div>

                {recipe.map((ing, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-2xl bg-stone-800/60 border border-stone-700/60 flex items-center justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-stone-700 flex items-center justify-center font-bold text-amber-400 text-xs">
                                #{idx + 1}
                            </div>
                            <span className="font-semibold text-white">{ing.name}</span>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-stone-900 px-3 py-1.5 rounded-xl border border-stone-700">
                                <input
                                    type="number"
                                    value={ing.quantity}
                                    onChange={(e) => {
                                        const qty = Number(e.target.value)
                                        setRecipe(prev => prev.map((item, i) => i === idx ? { ...item, quantity: qty, cost: qty * 0.8 } : item))
                                    }}
                                    className="w-16 bg-transparent font-bold text-amber-400 text-center focus:outline-none font-mono"
                                />
                                <span className="text-xs text-stone-400">{ing.unit}</span>
                            </div>

                            <span className="font-mono text-stone-300 w-20 text-right">₹{ing.cost.toFixed(2)}</span>

                            <button
                                onClick={() => handleRemoveIngredient(idx)}
                                className="p-2 text-stone-500 hover:text-red-400 transition"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
