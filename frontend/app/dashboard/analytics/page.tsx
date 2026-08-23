"use client";

import { useState } from "react";
import { LineChart, TrendingUp, IndianRupee, ShoppingBag, Users, Calendar, ArrowUpRight, BarChart3, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart as RechartsLine, Line, AreaChart, Area } from "recharts";

const HOURLY_SALES = [
  { hour: "8 AM", sales: 1200, orders: 8 },
  { hour: "9 AM", sales: 3400, orders: 19 },
  { hour: "10 AM", sales: 5200, orders: 28 },
  { hour: "11 AM", sales: 4800, orders: 24 },
  { hour: "12 PM", sales: 6100, orders: 31 },
  { hour: "1 PM", sales: 7400, orders: 38 },
  { hour: "2 PM", sales: 5800, orders: 27 },
  { hour: "3 PM", sales: 3900, orders: 18 },
  { hour: "4 PM", sales: 4900, orders: 23 },
  { hour: "5 PM", sales: 7800, orders: 41 },
  { hour: "6 PM", sales: 8900, orders: 49 },
  { hour: "7 PM", sales: 9400, orders: 52 },
  { hour: "8 PM", sales: 6800, orders: 35 },
  { hour: "9 PM", sales: 4200, orders: 21 },
];

const WEEKLY_TREND = [
  { day: "Mon", revenue: 24500, orders: 142, margin: 68 },
  { day: "Tue", revenue: 28900, orders: 165, margin: 71 },
  { day: "Wed", revenue: 27400, orders: 154, margin: 70 },
  { day: "Thu", revenue: 31200, orders: 178, margin: 69 },
  { day: "Fri", revenue: 42500, orders: 240, margin: 73 },
  { day: "Sat", revenue: 58900, orders: 310, margin: 75 },
  { day: "Sun", revenue: 64200, orders: 345, margin: 76 },
];

const TOP_PROFIT_ITEMS = [
  { name: "Vanilla Bean Latte", sold: 184, revenue: 40480, marginPct: 82 },
  { name: "Classic Cappuccino", sold: 265, revenue: 50350, marginPct: 79 },
  { name: "Pesto Mozzarella Panini", sold: 122, revenue: 31720, marginPct: 74 },
  { name: "Fudge Brownie", sold: 148, revenue: 23680, marginPct: 78 },
  { name: "Double Espresso", sold: 98, revenue: 13720, marginPct: 88 },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("week");

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Revenue & Profit Intelligence</h2>
          <p className="text-slate-500">Analyze sales velocity, peak cafe rush hours, gross profit margins, and repeat order rates.</p>
        </div>
        <div className="flex bg-white p-1 rounded-lg border shadow-sm">
          {["today", "week", "month"].map((t) => (
            <button
              key={t}
              onClick={() => setTimeRange(t)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors ${timeRange === t ? "bg-indigo-600 text-white" : "text-slate-600 hover:text-slate-900"}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-slate-500 uppercase">Gross Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">₹2,77,600</div>
            <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +18.4% vs last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-slate-500 uppercase">Average Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">₹328.40</div>
            <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +₹24.00 influenced by upsells
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-slate-500 uppercase">Est. Gross Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">72.8%</div>
            <p className="text-xs text-slate-500 mt-1">Food Cost: ~27.2%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-slate-500 uppercase">Direct Orders Share</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">84.2%</div>
            <p className="text-xs text-slate-500 mt-1">POS & QR Table (Zero commission)</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue & Hourly Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Daily Revenue Trend</CardTitle>
            <CardDescription>Sales distribution across the week</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={WEEKLY_TREND}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={v => `₹${v/1000}k`} />
                <Tooltip formatter={(value: any) => [`₹${value.toLocaleString()}`, "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Hourly Rush Heatmap</CardTitle>
            <CardDescription>Peak customer order volumes throughout the day</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={HOURLY_SALES}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={v => `₹${v/1000}k`} />
                <Tooltip formatter={(value: any) => [`₹${value.toLocaleString()}`, "Sales"]} />
                <Bar dataKey="sales" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Item Profitability Ranking */}
      <Card>
        <CardHeader>
          <CardTitle>Top Margin & Volume Products</CardTitle>
          <CardDescription>Items generating the largest absolute gross profit for your cafe.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {TOP_PROFIT_ITEMS.map((item, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-slate-50 rounded-xl border gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm">
                    #{idx + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{item.name}</h4>
                    <p className="text-xs text-slate-500">{item.sold} units sold this week</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Gross Margin</p>
                    <p className="text-sm font-bold text-emerald-600">{item.marginPct}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Gross Sales</p>
                    <p className="text-sm font-bold text-slate-900">₹{item.revenue.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
