"use client";

import { useState } from "react";
import { Megaphone, Send, Users, Sparkles, MessageSquare, Mail, Calendar, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function CampaignsPage() {
  const [selectedSegment, setSelectedSegment] = useState("dormant");
  const [channel, setChannel] = useState("WHATSAPP");
  const [message, setMessage] = useState("Hey {name}! We miss you at Café Noir ☕ Here is a special 20% off code 'COMEBACK20' valid this weekend only! Order now: cafe-noir.cafeos.in");
  const [campaignName, setCampaignName] = useState("Weekend Reactivation Blast");

  const [campaigns, setCampaigns] = useState([
    { id: "c-1", name: "Monsoon Coffee Treat", segment: "All Active Customers (184)", channel: "WhatsApp", sent: 184, opened: 162, converted: 38, revenue: 14200, status: "COMPLETED", date: "2026-08-18" },
    { id: "c-2", name: "Dormant Winback 20% Off", segment: "Inactive 14+ Days (62)", channel: "WhatsApp", sent: 62, opened: 54, converted: 12, revenue: 4650, status: "COMPLETED", date: "2026-08-10" },
    { id: "c-3", name: "VIP Espresso Tasting Invite", segment: "VIP Spenders (28)", channel: "SMS", sent: 28, opened: 28, converted: 19, revenue: 8900, status: "COMPLETED", date: "2026-08-01" },
  ]);

  const handleLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    const newCamp = {
      id: `c-${Date.now()}`,
      name: campaignName,
      segment: selectedSegment === "dormant" ? "Inactive 14+ Days (62)" : "VIP Spenders (28)",
      channel: channel === "WHATSAPP" ? "WhatsApp" : "SMS",
      sent: 62,
      opened: 0,
      converted: 0,
      revenue: 0,
      status: "QUEUED",
      date: new Date().toISOString().split('T')[0]
    };
    setCampaigns([newCamp, ...campaigns]);
    toast.success("Campaign queued for broadcast delivery!");
  };

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Campaigns & Automated Retention</h2>
        <p className="text-slate-500">Engage customers, win back dormant guests, and broadcast weekend offers via WhatsApp & SMS.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Campaign Builder */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-indigo-600" /> Create & Broadcast Campaign
            </CardTitle>
            <CardDescription>Target high-intent customer segments with tailored offers.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLaunch} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="cname">Campaign Name</Label>
                <Input 
                  id="cname" 
                  value={campaignName} 
                  onChange={e => setCampaignName(e.target.value)} 
                  required 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Audience Segment</Label>
                  <select 
                    value={selectedSegment} 
                    onChange={e => setSelectedSegment(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="dormant">Dormant Guests (No visit in 14+ days) — 62 customers</option>
                    <option value="vip">VIP High Spenders (₹1,500+ spend) — 28 customers</option>
                    <option value="new">New First-Timers (Joined this week) — 45 customers</option>
                    <option value="all">All Registered Customers — 285 customers</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label>Delivery Channel</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setChannel("WHATSAPP")}
                      className={`h-10 rounded-md border text-xs font-semibold flex items-center justify-center gap-1.5 ${channel === "WHATSAPP" ? "border-emerald-500 bg-emerald-50 text-emerald-800" : "bg-white text-slate-700"}`}
                    >
                      <MessageSquare className="w-4 h-4 text-emerald-600" /> WhatsApp
                    </button>
                    <button
                      type="button"
                      onClick={() => setChannel("SMS")}
                      className={`h-10 rounded-md border text-xs font-semibold flex items-center justify-center gap-1.5 ${channel === "SMS" ? "border-indigo-500 bg-indigo-50 text-indigo-800" : "bg-white text-slate-700"}`}
                    >
                      <Mail className="w-4 h-4 text-indigo-600" /> SMS
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="msg">Message Copy</Label>
                <Textarea 
                  id="msg" 
                  rows={4} 
                  value={message} 
                  onChange={e => setMessage(e.target.value)} 
                  required 
                />
                <p className="text-[11px] text-slate-500">Variables available: {"{name}"}, {"{shop}"}, {"{points}"}</p>
              </div>

              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
                <Send className="w-4 h-4 mr-2" /> Launch Broadcast to Segment
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Audience Recommendations */}
        <Card className="bg-indigo-50/40 border-indigo-100">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-indigo-900">
              <Sparkles className="w-4 h-4 text-indigo-600" /> Smart Opportunities
            </CardTitle>
            <CardDescription className="text-xs">Deterministic customer revenue triggers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-white rounded-xl border border-indigo-100 shadow-sm space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-900">62 Inactive Guests</span>
                <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-[10px]">High Impact</Badge>
              </div>
              <p className="text-xs text-slate-600">Customers who ordered twice but haven't visited in 14 days.</p>
              <button 
                onClick={() => {
                  setSelectedSegment("dormant");
                  setMessage("Hey {name}! ☕ We miss seeing you at Café Noir! Enjoy ₹50 OFF with code 'MISSYOU50' on your next coffee!");
                }}
                className="text-xs text-indigo-600 font-semibold hover:underline pt-1 block"
              >
                Apply Winback Template →
              </button>
            </div>

            <div className="p-3 bg-white rounded-xl border border-indigo-100 shadow-sm space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-900">28 VIP Members</span>
                <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-[10px]">Upsell</Badge>
              </div>
              <p className="text-xs text-slate-600">Top spenders eligible for artisan roast tasting invite.</p>
              <button 
                onClick={() => {
                  setSelectedSegment("vip");
                  setMessage("Special invitation for {name} ✨ Join our exclusive Single-Origin Cupping session this Saturday at Café Noir!");
                }}
                className="text-xs text-indigo-600 font-semibold hover:underline pt-1 block"
              >
                Apply VIP Template →
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance & ROI</CardTitle>
          <CardDescription>Attributed repeat orders and revenue recognized from delivered messages.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign Name</TableHead>
                  <TableHead>Target Audience</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead>Delivered</TableHead>
                  <TableHead>Orders Converted</TableHead>
                  <TableHead>Revenue Influenced</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-semibold text-slate-900">{c.name}</TableCell>
                    <TableCell className="text-xs">{c.segment}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">{c.channel}</Badge>
                    </TableCell>
                    <TableCell>{c.sent}</TableCell>
                    <TableCell className="font-medium">{c.converted} ({Math.round((c.converted / c.sent) * 100)}%)</TableCell>
                    <TableCell className="font-bold text-emerald-600">₹{c.revenue.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={c.status === "COMPLETED" ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-indigo-100 text-indigo-800"}>
                        {c.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
