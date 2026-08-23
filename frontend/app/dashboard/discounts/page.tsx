"use client";

import { useState } from "react";
import { Tag, Plus, Percent, DollarSign, Calendar, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface DiscountCode {
  id: string;
  code: string;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  minOrder: number;
  maxDiscount?: number;
  usageLimit?: number;
  usageCount: number;
  validUntil: string;
  isActive: boolean;
}

const INITIAL_DISCOUNTS: DiscountCode[] = [
  { id: "disc-1", code: "WELCOME50", type: "PERCENTAGE", value: 50, minOrder: 200, maxDiscount: 100, usageLimit: 500, usageCount: 42, validUntil: "2026-12-31", isActive: true },
  { id: "disc-2", code: "FLAT50", type: "FIXED", value: 50, minOrder: 300, usageLimit: 200, usageCount: 18, validUntil: "2026-09-30", isActive: true },
  { id: "disc-3", code: "COFFEEHOUR", type: "PERCENTAGE", value: 20, minOrder: 150, maxDiscount: 50, usageLimit: 1000, usageCount: 114, validUntil: "2026-10-15", isActive: true },
  { id: "disc-4", code: "VIP2026", type: "PERCENTAGE", value: 30, minOrder: 500, maxDiscount: 200, usageCount: 6, validUntil: "2026-12-31", isActive: false },
];

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<DiscountCode[]>(INITIAL_DISCOUNTS);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newDisc, setNewDisc] = useState({
    code: "",
    type: "PERCENTAGE" as "PERCENTAGE" | "FIXED",
    value: "",
    minOrder: "0",
    maxDiscount: "",
    usageLimit: "100",
    validUntil: "2026-12-31"
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDisc.code || !newDisc.value) return;

    const discount: DiscountCode = {
      id: `disc-${Date.now()}`,
      code: newDisc.code.toUpperCase(),
      type: newDisc.type,
      value: parseFloat(newDisc.value),
      minOrder: parseFloat(newDisc.minOrder) || 0,
      maxDiscount: newDisc.maxDiscount ? parseFloat(newDisc.maxDiscount) : undefined,
      usageLimit: newDisc.usageLimit ? parseInt(newDisc.usageLimit) : undefined,
      usageCount: 0,
      validUntil: newDisc.validUntil,
      isActive: true
    };

    setDiscounts([discount, ...discounts]);
    setIsCreateOpen(false);
    setNewDisc({ code: "", type: "PERCENTAGE", value: "", minOrder: "0", maxDiscount: "", usageLimit: "100", validUntil: "2026-12-31" });
    toast.success(`Coupon code ${discount.code} published!`);
  };

  const handleToggle = (id: string) => {
    setDiscounts(discounts.map(d => d.id === id ? { ...d, isActive: !d.isActive } : d));
  };

  const handleDelete = (id: string) => {
    setDiscounts(discounts.filter(d => d.id !== id));
    toast.info("Coupon deleted");
  };

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Coupons & Promotions</h2>
          <p className="text-slate-500">Create discount voucher codes for QR table ordering, online storefront, and POS.</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4 mr-2" /> Create Promo Code
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px]">
            <form onSubmit={handleCreate}>
              <DialogHeader>
                <DialogTitle>Create New Promo Code</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-1.5">
                  <Label htmlFor="code">Coupon Code (Uppercase)</Label>
                  <Input 
                    id="code" 
                    placeholder="e.g. MONSOON20" 
                    value={newDisc.code} 
                    onChange={e => setNewDisc({ ...newDisc, code: e.target.value.toUpperCase() })} 
                    required 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="type">Discount Type</Label>
                    <select 
                      id="type"
                      value={newDisc.type}
                      onChange={e => setNewDisc({ ...newDisc, type: e.target.value as any })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    >
                      <option value="PERCENTAGE">Percentage (%)</option>
                      <option value="FIXED">Flat Amount (₹)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="val">Value ({newDisc.type === "PERCENTAGE" ? "%" : "₹"})</Label>
                    <Input 
                      id="val" 
                      type="number" 
                      placeholder="20" 
                      value={newDisc.value} 
                      onChange={e => setNewDisc({ ...newDisc, value: e.target.value })} 
                      required 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="minOrder">Min Order Amount (₹)</Label>
                    <Input 
                      id="minOrder" 
                      type="number" 
                      placeholder="200" 
                      value={newDisc.minOrder} 
                      onChange={e => setNewDisc({ ...newDisc, minOrder: e.target.value })} 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="maxCap">Max Discount Cap (₹)</Label>
                    <Input 
                      id="maxCap" 
                      type="number" 
                      placeholder="100" 
                      value={newDisc.maxDiscount} 
                      onChange={e => setNewDisc({ ...newDisc, maxDiscount: e.target.value })} 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="limit">Total Usage Limit</Label>
                    <Input 
                      id="limit" 
                      type="number" 
                      placeholder="100" 
                      value={newDisc.usageLimit} 
                      onChange={e => setNewDisc({ ...newDisc, usageLimit: e.target.value })} 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="valid">Expiry Date</Label>
                    <Input 
                      id="valid" 
                      type="date" 
                      value={newDisc.validUntil} 
                      onChange={e => setNewDisc({ ...newDisc, validUntil: e.target.value })} 
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">Publish Code</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active & Historical Promo Codes</CardTitle>
          <CardDescription>Coupons are evaluated automatically with single-line verification at checkout.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Discount Value</TableHead>
                  <TableHead>Conditions</TableHead>
                  <TableHead>Redemptions</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {discounts.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell>
                      <span className="font-mono font-bold bg-slate-100 text-slate-900 px-2.5 py-1 rounded text-xs">
                        {d.code}
                      </span>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {d.type === "PERCENTAGE" ? `${d.value}% Off` : `₹${d.value} Flat Off`}
                    </TableCell>
                    <TableCell className="text-xs text-slate-600">
                      Min Order ₹{d.minOrder} {d.maxDiscount ? `(Cap: ₹${d.maxDiscount})` : ""}
                    </TableCell>
                    <TableCell className="font-medium">
                      {d.usageCount} {d.usageLimit ? `/ ${d.usageLimit}` : ""} used
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">{d.validUntil}</TableCell>
                    <TableCell>
                      <button onClick={() => handleToggle(d.id)}>
                        {d.isActive ? (
                          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200">Active</Badge>
                        ) : (
                          <Badge className="bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200">Paused</Badge>
                        )}
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(d.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
