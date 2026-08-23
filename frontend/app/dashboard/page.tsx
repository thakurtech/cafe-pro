"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, ArrowDownRight, IndianRupee, ShoppingBag, Receipt, Users, AlertCircle, Clock, ExternalLink, Megaphone, ChefHat } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function DashboardHome() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mocking API call for now, assuming local storage has token & shopId
    const fetchData = async () => {
      try {
        setLoading(true);
        // const token = localStorage.getItem('auth_token');
        // const shopId = localStorage.getItem('shopId') || '1';
        
        // In a real app we'd fetch these:
        // const [statsRes, subRes] = await Promise.all([
        //   fetch(`${API}/shops/${shopId}/stats`, { headers: { Authorization: `Bearer ${token}` } }),
        //   fetch(`${API}/subscriptions/${shopId}`, { headers: { Authorization: `Bearer ${token}` } })
        // ]);
        
        // Mock data matching the requirements
        setTimeout(() => {
          setStats({
            todayRevenue: 12450,
            revenueChange: 14.5,
            todayOrders: 86,
            ordersChange: -2.3,
            avgOrderValue: 144,
            aovChange: 5.1,
            repeatRate: 42,
            repeatChange: 1.2,
            revenueChart: [
              { day: 'Mon', revenue: 8400 },
              { day: 'Tue', revenue: 9200 },
              { day: 'Wed', revenue: 10500 },
              { day: 'Thu', revenue: 9800 },
              { day: 'Fri', revenue: 14200 },
              { day: 'Sat', revenue: 18500 },
              { day: 'Sun', revenue: 12450 },
            ],
            topItems: [
              { name: 'Cappuccino', qty: 45, revenue: 6750 },
              { name: 'Cold Coffee', qty: 38, revenue: 5700 },
              { name: 'Peri Peri Fries', qty: 29, revenue: 3480 },
              { name: 'Margherita Pizza', qty: 22, revenue: 6380 },
              { name: 'Choco Lava Cake', qty: 18, revenue: 2160 },
            ],
            recentOrders: [
              { id: '1042', time: '10 mins ago', items: 3, total: 450, status: 'Completed' },
              { id: '1043', time: '8 mins ago', items: 1, total: 120, status: 'Preparing' },
              { id: '1044', time: '5 mins ago', items: 5, total: 1250, status: 'Preparing' },
              { id: '1045', time: '2 mins ago', items: 2, total: 340, status: 'New' },
              { id: '1046', time: 'Just now', items: 1, total: 150, status: 'New' },
            ]
          });
          
          setSubscription({
            isTrial: true,
            daysLeft: 12,
            plan: 'Trial'
          });
          setLoading(false);
        }, 600);

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8 flex justify-center items-center h-full"><div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 pt-6">
      
      {/* Trial Banner */}
      {subscription?.isTrial && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between text-indigo-900 shadow-sm">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-indigo-600" />
            <p className="font-medium">
              {subscription.daysLeft} days left in your trial. Unlock all features forever!
            </p>
          </div>
          <Button variant="default" className="bg-indigo-600 hover:bg-indigo-700 text-white mt-3 sm:mt-0">
            Upgrade for ₹499/month
          </Button>
        </div>
      )}

      {/* Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h2>
          <p className="text-slate-500">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="hidden md:flex" onClick={() => router.push('/dashboard/campaigns')}>
            <Megaphone className="mr-2 h-4 w-4" /> Create Campaign
          </Button>
          <Button variant="outline" className="hidden md:flex" onClick={() => router.push('/kitchen')}>
            <ChefHat className="mr-2 h-4 w-4" /> View Live Kitchen
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => router.push('/pos')}>
            <ExternalLink className="mr-2 h-4 w-4" /> Open POS
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.todayRevenue.toLocaleString()}</div>
            <p className={`text-xs flex items-center mt-1 ${stats.revenueChange >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {stats.revenueChange >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
              {Math.abs(stats.revenueChange)}% from yesterday
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayOrders}</div>
            <p className={`text-xs flex items-center mt-1 ${stats.ordersChange >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {stats.ordersChange >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
              {Math.abs(stats.ordersChange)}% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.avgOrderValue}</div>
            <p className={`text-xs flex items-center mt-1 ${stats.aovChange >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {stats.aovChange >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
              {Math.abs(stats.aovChange)}% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Repeat Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.repeatRate}%</div>
            <p className={`text-xs flex items-center mt-1 ${stats.repeatChange >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {stats.repeatChange >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
              {Math.abs(stats.repeatChange)}% from last week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts & Top Items Row */}
      <div className="grid gap-4 md:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.revenueChart}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} tickFormatter={(value) => `₹${value}`} dx={-10} />
                  <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Top Selling Items</CardTitle>
            <CardDescription>Today's best performers by quantity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {stats.topItems.map((item: any, i: number) => (
                <div key={i} className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-sm">
                    {i + 1}
                  </div>
                  <div className="ml-4 space-y-1 flex-1">
                    <p className="text-sm font-medium leading-none">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.qty} orders</p>
                  </div>
                  <div className="ml-auto font-medium">₹{item.revenue.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Third Row: Alerts, Ops, Recent Orders */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Alerts & Insights */}
        <div className="space-y-4">
          <Card className="border-orange-200 bg-orange-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center text-orange-800">
                <AlertCircle className="w-5 h-5 mr-2" /> Needs Attention
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-white p-3 rounded-md border border-orange-100 shadow-sm text-sm">
                <span className="font-semibold text-orange-700">Low Stock:</span> Milk (Whole) - Only 2L left.
              </div>
              <div className="bg-white p-3 rounded-md border border-orange-100 shadow-sm text-sm">
                <span className="font-semibold text-orange-700">Staff:</span> Chef Rahul is 30 mins late.
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center text-blue-800">
                <Megaphone className="w-5 h-5 mr-2" /> Revenue Opportunity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-900 mb-3">
                You have <strong>15 customers</strong> who haven't ordered in 14+ days.
              </p>
              <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Send SMS Campaign
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest orders from POS & QR</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/orders">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentOrders.map((order: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-100 p-2 rounded-md">
                      <Receipt className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Order #{order.id}</p>
                      <p className="text-xs text-muted-foreground">{order.time} • {order.items} items</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-bold">₹{order.total}</p>
                      <Badge variant={order.status === 'Completed' ? 'default' : order.status === 'Preparing' ? 'secondary' : 'outline'}
                        className={order.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100' : ''}
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
