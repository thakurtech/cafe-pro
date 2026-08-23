"use client";

import { useState } from "react";
import { CreditCard, Check, Sparkles, Shield, Clock, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

export default function SubscriptionPage() {
  const [currentPlan, setCurrentPlan] = useState("STARTER");
  const [trialDaysLeft, setTrialDaysLeft] = useState(14);

  const PLANS = [
    {
      id: "STARTER",
      name: "Starter",
      price: 499,
      period: "/month /outlet",
      description: "Complete restaurant operating system for independent cafes & eateries.",
      popular: false,
      features: [
        "Full Counter POS & Offline Order Mode",
        "Kitchen Display System (KDS)",
        "Branded Storefront (yourcafe.cafeos.in)",
        "Table QR Ordering & Guest Checkout",
        "Inventory & Recipe Deduction",
        "Customer CRM & Loyalty Points",
        "Unlimited Orders (Zero direct commission)",
        "Thermal KOT Receipt Printing"
      ]
    },
    {
      id: "GROWTH",
      name: "Growth",
      price: 999,
      period: "/month /outlet",
      description: "Advanced marketing, automated retargeting, and gamification.",
      popular: true,
      features: [
        "Everything in Starter, plus:",
        "Automated WhatsApp Campaign Blasts",
        "Post-Order Scratch Card Game Engine",
        "Customer Segment Intelligence (Dormant/VIP)",
        "Deep Recipe Wastage & Supplier POs",
        "Custom Subdomain (cafe.yourbrand.com)",
        "Staff Permissions & Shift Cash Reports",
        "Priority 24/7 WhatsApp Support"
      ]
    },
    {
      id: "PRO",
      name: "Pro",
      price: 1999,
      period: "/month /outlet",
      description: "Multi-outlet chains, franchise controls, and accounting integrations.",
      popular: false,
      features: [
        "Everything in Growth, plus:",
        "Multi-Outlet Centralized Dashboard",
        "Aggregator Menu & Order Sync (Swiggy/Zomato)",
        "Tally / Zoho Accounting Exports",
        "Daily Spin & Win Wheel Gamification",
        "VIP High-Spender Auto Tier Upgrades",
        "Custom Payment Gateway Routing",
        "Dedicated Account Success Manager"
      ]
    }
  ];

  const handleUpgrade = (planId: string) => {
    setCurrentPlan(planId);
    toast.success(`Subscription updated to ${planId} plan!`);
  };

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Subscription & Billing</h2>
        <p className="text-slate-500">Manage your CaféOS subscription, active billing cycle, and plan tier.</p>
      </div>

      {/* Active Status Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-950 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500 text-white font-semibold text-xs">● Active 14-Day Trial</Badge>
            <span className="text-xs text-slate-400">Plan: Starter (₹499/mo)</span>
          </div>
          <h3 className="text-2xl font-bold text-white">14 Days Remaining in Free Trial</h3>
          <p className="text-sm text-slate-300">Your full cafe operating suite is unlocked with zero feature restrictions.</p>
        </div>
        <Button 
          onClick={() => toast.success("Razorpay payment gateway initialized for ₹499/month activation.")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-5 shrink-0 shadow-lg shadow-indigo-600/30"
        >
          <Zap className="w-4 h-4 mr-2" /> Activate Subscription (₹499/mo)
        </Button>
      </div>

      {/* Plan Tier Cards */}
      <div className="grid gap-6 md:grid-cols-3 pt-4">
        {PLANS.map((plan) => {
          const isCurrent = currentPlan === plan.id;
          return (
            <Card key={plan.id} className={`flex flex-col justify-between relative transition-all duration-200 ${plan.popular ? "border-indigo-600 shadow-lg ring-1 ring-indigo-600/20" : ""}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider shadow">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <div className="flex justify-between items-center mb-1">
                  <CardTitle className="text-xl font-bold text-slate-900">{plan.name}</CardTitle>
                  {isCurrent && (
                    <Badge variant="outline" className="text-indigo-600 bg-indigo-50 border-indigo-200">Current Plan</Badge>
                  )}
                </div>
                <CardDescription className="text-xs min-h-[36px]">{plan.description}</CardDescription>
                <div className="pt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-slate-900">₹{plan.price}</span>
                  <span className="text-xs text-slate-500 ml-1.5">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-2">
                <ul className="space-y-2 text-xs text-slate-600">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-4 border-t">
                  <Button 
                    onClick={() => handleUpgrade(plan.id)}
                    variant={isCurrent ? "outline" : "default"}
                    className={`w-full ${!isCurrent ? "bg-indigo-600 hover:bg-indigo-700 text-white" : ""}`}
                  >
                    {isCurrent ? "Current Tier" : `Switch to ${plan.name}`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
