"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Coffee, 
  ShoppingCart, 
  ChefHat, 
  QrCode, 
  Sparkles, 
  Zap, 
  TrendingUp, 
  ShieldCheck, 
  Star, 
  ArrowRight, 
  Check, 
  Smartphone, 
  Users, 
  BarChart3, 
  Layers, 
  MessageSquare, 
  Gamepad2, 
  CreditCard,
  Percent,
  IndianRupee,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<"storefront" | "pos" | "kds" | "revenue">("storefront");
  const [dailyOrders, setDailyOrders] = useState(60);
  const [avgOrderValue, setAvgOrderValue] = useState(320);

  // Aggregator 28% commission vs CafeOS ₹499/mo
  const monthlyRevenue = dailyOrders * avgOrderValue * 30;
  const aggregatorLoss = Math.round(monthlyRevenue * 0.28);
  const cafeosCost = 499;
  const monthlySavings = aggregatorLoss - cafeosCost;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white font-sans antialiased overflow-x-hidden">
      
      {/* ── Top Live Persona Bar ── */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-950 border-b border-indigo-500/20 px-4 py-2 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-white tracking-wide uppercase text-[11px]">System Live (Supabase + Razorpay):</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 font-medium text-[11px]">
            <Link href="/shop/cafe-noir" target="_blank" className="hover:text-emerald-400 flex items-center gap-1 transition-colors bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded">
              ☕ Customer Storefront <ExternalLink className="w-3 h-3" />
            </Link>
            <Link href="/pos" className="hover:text-indigo-400 flex items-center gap-1 transition-colors bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded">
              💳 Counter POS <ExternalLink className="w-3 h-3" />
            </Link>
            <Link href="/kitchen" className="hover:text-amber-400 flex items-center gap-1 transition-colors bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded">
              🍳 Live Kitchen KDS <ExternalLink className="w-3 h-3" />
            </Link>
            <Link href="/dashboard" className="hover:text-purple-400 flex items-center gap-1 transition-colors bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded">
              📊 Owner Dashboard <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Sticky Header Navigation ── */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              <Coffee className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold text-white tracking-tight leading-none">CafeOS</span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">Restaurant OS</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#preview" className="hover:text-white transition-colors">Interactive Demo</a>
            <a href="#calculator" className="hover:text-white transition-colors">ROI Calculator</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-800 text-xs">
                Merchant Login
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/25">
                Open Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 px-4 sm:px-6 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="bg-indigo-500/10 text-indigo-300 border-indigo-500/30 px-3.5 py-1 text-xs font-semibold rounded-full">
              ✨ The Operating System & Revenue Engine for Indian Cafés
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1]"
          >
            Replace Fragmented Software with a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Revenue Engine
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed"
          >
            Stop paying 28% aggregator cuts. Get lightning-fast Counter POS, branded Table QR ordering, real-time Kitchen KDS, gamified scratch cards, and direct UPI settlements — all in one unified platform.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4"
          >
            <Link href="/shop/cafe-noir" target="_blank" className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-7 py-6 shadow-xl shadow-emerald-600/20 gap-2">
                <Coffee className="w-4 h-4" /> Try Customer Storefront
              </Button>
            </Link>
            <Link href="/pos" className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-7 py-6 shadow-xl shadow-indigo-600/25 gap-2">
                <ShoppingCart className="w-4 h-4" /> Launch Cashier POS
              </Button>
            </Link>
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full border-slate-700 hover:bg-slate-900 text-slate-200 font-semibold text-sm px-7 py-6 gap-2">
                Merchant Hub <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>

          {/* Trust badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Direct UPI Settlement
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" /> Flat ₹499/Month (0% Commission)
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-indigo-400" /> 14-Day Free Trial (No Card Needed)
            </div>
          </div>
        </div>
      </section>

      {/* ── Interactive System Preview (Tabbed) ── */}
      <section id="preview" className="py-16 px-4 sm:px-6 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">Experience the Entire Cafe OS Flow</h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
              Click through the live subsystem views to see how customer orders flow seamlessly to the kitchen and ledger.
            </p>
          </div>

          {/* Tab buttons */}
          <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-slate-950 rounded-2xl border border-slate-800 max-w-2xl mx-auto">
            <button
              onClick={() => setActiveTab("storefront")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${activeTab === "storefront" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-white"}`}
            >
              <Smartphone className="w-4 h-4" /> 1. Customer Storefront
            </button>
            <button
              onClick={() => setActiveTab("pos")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${activeTab === "pos" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-white"}`}
            >
              <ShoppingCart className="w-4 h-4" /> 2. Cashier POS
            </button>
            <button
              onClick={() => setActiveTab("kds")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${activeTab === "kds" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-white"}`}
            >
              <ChefHat className="w-4 h-4" /> 3. Kitchen KDS
            </button>
            <button
              onClick={() => setActiveTab("revenue")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${activeTab === "revenue" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-white"}`}
            >
              <BarChart3 className="w-4 h-4" /> 4. Owner Insights
            </button>
          </div>

          {/* Interactive Screen Preview */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 sm:p-8 shadow-2xl overflow-hidden relative min-h-[420px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {activeTab === "storefront" && (
                <motion.div
                  key="storefront"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
                >
                  <div className="space-y-4 text-left">
                    <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/30">Branded Digital Storefront</Badge>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white">Your Cafe. Your Domain. Zero Forced Apps.</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Customers scan the table QR code or visit your custom link. They browse rich modifier options (Oat Milk, Syrups), apply promo codes, and pay instantly via Razorpay UPI or Pay at Counter.
                    </p>
                    <div className="space-y-2 pt-2 text-xs text-slate-300">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" /> Dynamic Theme Customization (Match your cafe's brand)
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" /> Frictionless guest checkout (Phone number capture for loyalty)
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" /> Live order status ticker with confetti celebration
                      </div>
                    </div>
                    <div className="pt-2">
                      <Link href="/shop/cafe-noir" target="_blank">
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs gap-1.5">
                          Open Live Storefront <ExternalLink className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Mock Phone Preview */}
                  <div className="p-4 bg-slate-900 rounded-3xl border border-slate-800 max-w-xs mx-auto shadow-2xl space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-800 text-xs text-slate-400">
                      <span className="font-bold text-white">☕ Café Noir</span>
                      <span>Table #4</span>
                    </div>
                    <div className="p-3 bg-indigo-950/40 border border-indigo-800/40 rounded-xl">
                      <p className="text-[10px] text-indigo-300 font-semibold uppercase">Featured Roast</p>
                      <h4 className="text-sm font-bold text-white">Vanilla Bean Latte</h4>
                      <p className="text-xs text-emerald-400 font-bold mt-1">₹220</p>
                    </div>
                    <div className="p-3 bg-slate-800/60 rounded-xl space-y-1">
                      <div className="flex justify-between text-xs text-slate-300 font-medium">
                        <span>1x Classic Cappuccino</span>
                        <span>₹190</span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-300 font-medium">
                        <span>1x Butter Croissant</span>
                        <span>₹130</span>
                      </div>
                    </div>
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center">
                      <p className="text-xs font-bold text-emerald-400">Pay ₹336 via UPI (GPay/PhonePe)</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "pos" && (
                <motion.div
                  key="pos"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
                >
                  <div className="space-y-4 text-left">
                    <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">Tactile Counter Terminal</Badge>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white">Blazing Fast POS for Rush Hours</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Optimized for speed on touch tablets and desktops. Tap categories, select modifier options, assign tables, split payments, and hold orders with one click.
                    </p>
                    <div className="space-y-2 pt-2 text-xs text-slate-300">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" /> Hold & Resume order queue during long lines
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" /> Direct thermal ESC/POS 80mm receipt printing
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" /> Real-time shift cash drawer reconciliation
                      </div>
                    </div>
                    <div className="pt-2">
                      <Link href="/pos">
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5">
                          Launch Full POS Terminal <ExternalLink className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* POS Mock Ticket */}
                  <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-3 max-w-sm mx-auto shadow-2xl">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                      <span className="text-xs font-bold text-white">Order Ticket #1042</span>
                      <Badge className="bg-indigo-500 text-white text-[10px]">Dine-In • Table 3</Badge>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between text-slate-200">
                        <span>2x Double Espresso</span>
                        <span className="font-semibold">₹280</span>
                      </div>
                      <div className="flex justify-between text-slate-200">
                        <span>1x Pesto Mozzarella Panini</span>
                        <span className="font-semibold">₹260</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-sm text-white">
                      <span>Total (incl. 5% GST)</span>
                      <span className="text-emerald-400">₹567</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="py-2 bg-slate-800 rounded-lg text-center text-xs font-bold text-slate-300">Cash (₹600) → Change ₹33</div>
                      <div className="py-2 bg-emerald-600 rounded-lg text-center text-xs font-bold text-white">Paid ✓</div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "kds" && (
                <motion.div
                  key="kds"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="w-full max-w-4xl space-y-6 text-left"
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <div>
                      <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30">Live Kitchen Display System</Badge>
                      <h3 className="text-2xl font-bold text-white mt-1">High-Contrast 3-Column Kitchen Screen</h3>
                    </div>
                    <Link href="/kitchen">
                      <Button className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs gap-1.5">
                        Open Fullscreen KDS <ExternalLink className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-amber-400 uppercase tracking-wide">New Orders</span>
                        <span className="text-[10px] text-slate-500">2 min ago</span>
                      </div>
                      <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                        <p className="text-xs font-bold text-white">#1045 (Table 2)</p>
                        <p className="text-xs text-slate-300 mt-1">1x Classic Cappuccino (Oat Milk)</p>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-indigo-400 uppercase tracking-wide">Preparing</span>
                        <span className="text-[10px] text-indigo-400 font-mono">⏱ 4:12</span>
                      </div>
                      <div className="p-2.5 bg-slate-950 rounded-lg border border-indigo-900/40">
                        <p className="text-xs font-bold text-white">#1044 (Takeaway)</p>
                        <p className="text-xs text-slate-300 mt-1">2x Vanilla Bean Latte</p>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-emerald-400 uppercase tracking-wide">Ready for Pickup</span>
                        <span className="text-[10px] text-emerald-400">🔔 Chime</span>
                      </div>
                      <div className="p-2.5 bg-slate-950 rounded-lg border border-emerald-900/40">
                        <p className="text-xs font-bold text-white">#1042 (Table 3)</p>
                        <p className="text-xs text-slate-300 mt-1">Panini + Espresso</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "revenue" && (
                <motion.div
                  key="revenue"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
                >
                  <div className="space-y-4 text-left">
                    <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/30">Owner Intelligence Hub</Badge>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white">Deterministic Revenue Opportunities</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Real-time visibility into peak rush hours, item food margins, and automated customer segment retargeting via WhatsApp broadcasts.
                    </p>
                    <div className="space-y-2 pt-2 text-xs text-slate-300">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" /> Automated winback triggers for dormant guests
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" /> Product margin & food cost breakdown
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" /> Complete multi-tenant billing & floor plan
                      </div>
                    </div>
                    <div className="pt-2">
                      <Link href="/dashboard">
                        <Button className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs gap-1.5">
                          View Merchant Analytics <ExternalLink className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Analytics Snapshot */}
                  <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-4 max-w-sm mx-auto shadow-2xl">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">Today's Revenue</span>
                      <span className="text-xs font-bold text-emerald-400">↑ 18.4% vs yday</span>
                    </div>
                    <h4 className="text-3xl font-extrabold text-white">₹42,850</h4>
                    <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Direct Orders</span>
                        <span className="text-white font-bold">142 Orders (88%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Aggregator Cuts Saved</span>
                        <span className="text-emerald-400 font-bold">₹11,998 today</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── 4 Pillars Section ── */}
      <section id="features" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/30">Complete Feature Matrix</Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">Built for High-Velocity Cafe Operations</h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Replace 6 separate monthly software subscriptions with one cohesive restaurant operating system.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-slate-900/60 border-slate-800 hover:border-slate-700 transition-colors">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">1. Operate</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Counter POS with table maps, dark-mode kitchen KDS, 80mm ESC/POS receipt printing, and cashier cash reconciliation.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-slate-800 hover:border-slate-700 transition-colors">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <IndianRupee className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">2. Direct Monetize</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Branded web storefront, table QR scan menus, Razorpay UPI checkouts, and 0% commission direct customer relationships.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-slate-800 hover:border-slate-700 transition-colors">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Gamepad2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">3. Gamify & Retain</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Post-order scratch cards, points-to-rupee loyalty wallets, digital stamp cards, and automated WhatsApp winback campaigns.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-slate-800 hover:border-slate-700 transition-colors">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">4. Control</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Real-time raw material inventory, recipe deductions, staff permission roles (Cashier/Chef/Manager), and audit logs.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── Interactive Savings Calculator ── */}
      <section id="calculator" className="py-16 px-4 sm:px-6 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-t border-slate-800">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">Calculate Your Direct ROI</Badge>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">How Much Are Aggregator Cuts Costing You?</h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              Compare paying 28% commissions on every order vs a flat ₹499/month on CaféOS.
            </p>
          </div>

          <div className="p-6 sm:p-8 bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300 font-medium">Daily Orders</span>
                  <span className="font-bold text-indigo-400">{dailyOrders} orders / day</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="300" 
                  step="5"
                  value={dailyOrders} 
                  onChange={e => setDailyOrders(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300 font-medium">Average Order Value (AOV)</span>
                  <span className="font-bold text-indigo-400">₹{avgOrderValue}</span>
                </div>
                <input 
                  type="range" 
                  min="100" 
                  max="1200" 
                  step="20"
                  value={avgOrderValue} 
                  onChange={e => setAvgOrderValue(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
                />
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Gross Monthly Volume:</span>
                  <span className="font-bold text-white">₹{monthlyRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>28% Aggregator Commission:</span>
                  <span className="font-bold text-red-400">-₹{aggregatorLoss.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-800">
                  <span>CaféOS Flat Subscription:</span>
                  <span className="font-bold text-emerald-400">₹499 / month</span>
                </div>
              </div>
            </div>

            {/* Big Savings Output */}
            <div className="p-6 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-indigo-950/40 rounded-2xl border border-emerald-500/30 text-center space-y-3">
              <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">Estimated Monthly Profit Retained</span>
              <h3 className="text-4xl sm:text-5xl font-extrabold text-emerald-400">
                +₹{monthlySavings.toLocaleString()}
              </h3>
              <p className="text-xs text-slate-400">
                That's <span className="text-white font-bold">₹{(monthlySavings * 12).toLocaleString()} / year</span> kept in your cafe's bank account instead of lost to platform commissions.
              </p>
              <div className="pt-2">
                <Link href="/register">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-5 shadow-lg shadow-emerald-600/30">
                    Start 14-Day Free Trial
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Transparent Pricing Grid ── */}
      <section id="pricing" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/30">Transparent Pricing</Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">Flat Monthly Pricing. Zero Per-Order Tax.</h2>
          <p className="text-slate-400 text-sm">
            Everything your cafe needs to operate, monetize, and scale profitably.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {/* Starter */}
          <Card className="bg-slate-900/60 border-slate-800 flex flex-col justify-between">
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white">Starter</h3>
                <p className="text-xs text-slate-400 mt-1">For independent single-outlet cafes & bakeries.</p>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-white">₹499</span>
                  <span className="text-xs text-slate-400 ml-1.5">/month /outlet</span>
                </div>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Full Counter POS & Thermal KOT</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Branded Storefront & QR Tables</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Kitchen Display Screen (KDS)</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Customer Loyalty Points Engine</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> 0% Per-Order Commission</li>
              </ul>
              <Link href="/register">
                <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs">
                  Start Free Trial
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Growth */}
          <Card className="bg-slate-900 border-indigo-500 shadow-xl shadow-indigo-600/15 relative flex flex-col justify-between">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
              Most Popular
            </div>
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white">Growth</h3>
                <p className="text-xs text-slate-400 mt-1">Advanced retargeting & gamification engine.</p>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-white">₹999</span>
                  <span className="text-xs text-slate-400 ml-1.5">/month /outlet</span>
                </div>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Everything in Starter</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Post-Order Scratch Cards</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> WhatsApp Campaign Retargeting</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Dormant & VIP Customer Segments</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Staff Roles & Register Cash Balancing</li>
              </ul>
              <Link href="/register">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/30">
                  Start Free Trial
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Pro */}
          <Card className="bg-slate-900/60 border-slate-800 flex flex-col justify-between">
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white">Pro Chain</h3>
                <p className="text-xs text-slate-400 mt-1">For multi-outlet brands & franchise operations.</p>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-white">₹1,999</span>
                  <span className="text-xs text-slate-400 ml-1.5">/month /outlet</span>
                </div>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Everything in Growth</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Multi-Outlet Central Dashboard</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Daily Spin-the-Wheel Gamification</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Custom Domain (cafe.yourbrand.com)</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Dedicated Account Manager</li>
              </ul>
              <Link href="/register">
                <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs">
                  Contact Sales
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
              <Coffee className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg text-white">CafeOS</span>
            <span className="text-xs text-slate-500 ml-2">© 2026 CafeOS Technologies. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <Link href="/shop/cafe-noir" target="_blank" className="hover:text-white transition-colors">Demo Storefront</Link>
            <Link href="/pos" className="hover:text-white transition-colors">POS Terminal</Link>
            <Link href="/kitchen" className="hover:text-white transition-colors">Kitchen Display</Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">Merchant Dashboard</Link>
            <Link href="/super-admin" className="hover:text-white transition-colors">Platform Admin</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
