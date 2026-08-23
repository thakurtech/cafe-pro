"use client";

import { useState } from "react";
import { Package, AlertTriangle, Plus, Search, ArrowUpDown, Filter, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  lowStockThreshold: number;
  costPerUnit: number;
  category: string;
  lastRestocked: string;
}

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: "inv-1", name: "Arabica Coffee Beans", quantity: 18.5, unit: "kg", lowStockThreshold: 5, costPerUnit: 850, category: "Raw Materials", lastRestocked: "2026-08-20" },
  { id: "inv-2", name: "Whole Milk", quantity: 6.0, unit: "liters", lowStockThreshold: 10, costPerUnit: 65, category: "Dairy", lastRestocked: "2026-08-23" },
  { id: "inv-3", name: "Oat Milk (Barista Edition)", quantity: 14.0, unit: "liters", lowStockThreshold: 4, costPerUnit: 240, category: "Dairy Alternatives", lastRestocked: "2026-08-21" },
  { id: "inv-4", name: "Butter (Unsalted)", quantity: 3.2, unit: "kg", lowStockThreshold: 5, costPerUnit: 520, category: "Bakery", lastRestocked: "2026-08-19" },
  { id: "inv-5", name: "Vanilla Syrup", quantity: 4.5, unit: "bottles", lowStockThreshold: 2, costPerUnit: 480, category: "Syrups", lastRestocked: "2026-08-15" },
  { id: "inv-6", name: "Croissant Dough Sheets", quantity: 45, unit: "pcs", lowStockThreshold: 20, costPerUnit: 35, category: "Bakery", lastRestocked: "2026-08-22" },
  { id: "inv-7", name: "Takeaway Cups 250ml", quantity: 280, unit: "pcs", lowStockThreshold: 100, costPerUnit: 4.5, category: "Packaging", lastRestocked: "2026-08-18" },
  { id: "inv-8", name: "Paper Straws", quantity: 450, unit: "pcs", lowStockThreshold: 150, costPerUnit: 0.8, category: "Packaging", lastRestocked: "2026-08-18" }
];

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: "",
    unit: "kg",
    lowStockThreshold: "5",
    costPerUnit: "",
    category: "Raw Materials"
  });

  const lowStockCount = items.filter(i => i.quantity <= i.lowStockThreshold).length;
  const totalValuation = items.reduce((acc, i) => acc + (i.quantity * i.costPerUnit), 0);

  const filteredItems = items.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase()) || 
    i.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.quantity) return;

    const item: InventoryItem = {
      id: `inv-${Date.now()}`,
      name: newItem.name,
      quantity: parseFloat(newItem.quantity),
      unit: newItem.unit,
      lowStockThreshold: parseFloat(newItem.lowStockThreshold) || 5,
      costPerUnit: parseFloat(newItem.costPerUnit) || 0,
      category: newItem.category,
      lastRestocked: new Date().toISOString().split('T')[0]
    };

    setItems([item, ...items]);
    setIsAddOpen(false);
    setNewItem({ name: "", quantity: "", unit: "kg", lowStockThreshold: "5", costPerUnit: "", category: "Raw Materials" });
    toast.success("Stock item added successfully!");
  };

  const handleQuickAdjust = (id: string, delta: number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const nextQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: parseFloat(nextQty.toFixed(1)) };
      }
      return item;
    }));
  };

  const handleDelete = (id: string) => {
    setItems(items.filter(i => i.id !== id));
    toast.info("Item removed from inventory");
  };

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Inventory & Stock</h2>
          <p className="text-slate-500">Track raw materials, packaging, and automatic recipe consumption.</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="w-4 h-4 mr-2" /> Add Stock Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px]">
              <form onSubmit={handleAddItem}>
                <DialogHeader>
                  <DialogTitle>Add Inventory Item</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Item Name</Label>
                    <Input 
                      id="name" 
                      placeholder="e.g. Cocoa Powder" 
                      value={newItem.name} 
                      onChange={e => setNewItem({ ...newItem, name: e.target.value })} 
                      required 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="qty">Current Quantity</Label>
                      <Input 
                        id="qty" 
                        type="number" 
                        step="0.1" 
                        placeholder="10" 
                        value={newItem.quantity} 
                        onChange={e => setNewItem({ ...newItem, quantity: e.target.value })} 
                        required 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="unit">Unit</Label>
                      <Input 
                        id="unit" 
                        placeholder="kg / liters / pcs" 
                        value={newItem.unit} 
                        onChange={e => setNewItem({ ...newItem, unit: e.target.value })} 
                        required 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="threshold">Low Stock Alert</Label>
                      <Input 
                        id="threshold" 
                        type="number" 
                        placeholder="5" 
                        value={newItem.lowStockThreshold} 
                        onChange={e => setNewItem({ ...newItem, lowStockThreshold: e.target.value })} 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="cost">Cost per Unit (₹)</Label>
                      <Input 
                        id="cost" 
                        type="number" 
                        placeholder="250" 
                        value={newItem.costPerUnit} 
                        onChange={e => setNewItem({ ...newItem, costPerUnit: e.target.value })} 
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="cat">Category</Label>
                    <Input 
                      id="cat" 
                      placeholder="Raw Materials / Dairy / Bakery" 
                      value={newItem.category} 
                      onChange={e => setNewItem({ ...newItem, category: e.target.value })} 
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                  <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">Save Item</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Tracked Items</CardTitle>
            <Package className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{items.length}</div>
            <p className="text-xs text-slate-500 mt-1">Across 5 inventory categories</p>
          </CardContent>
        </Card>

        <Card className={lowStockCount > 0 ? "border-amber-200 bg-amber-50/40" : ""}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-amber-800">Low Stock Alerts</CardTitle>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">{lowStockCount} Items</div>
            <p className="text-xs text-amber-700 mt-1">Needs procurement reorder</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Estimated Inventory Valuation</CardTitle>
            <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">Current</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">₹{totalValuation.toLocaleString()}</div>
            <p className="text-xs text-slate-500 mt-1">Based on latest purchase cost basis</p>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Stock List</CardTitle>
              <CardDescription>Real-time quantities linked to menu item recipe deductions.</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search stock..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Quantity on Hand</TableHead>
                  <TableHead>Unit Cost</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Quick Stock Adjust</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => {
                  const isLow = item.quantity <= item.lowStockThreshold;
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-semibold text-slate-900">{item.name}</TableCell>
                      <TableCell><Badge variant="outline" className="font-normal">{item.category}</Badge></TableCell>
                      <TableCell>
                        <span className="font-bold text-slate-800">{item.quantity}</span> {item.unit}
                      </TableCell>
                      <TableCell>₹{item.costPerUnit}</TableCell>
                      <TableCell className="font-medium">₹{(item.quantity * item.costPerUnit).toLocaleString()}</TableCell>
                      <TableCell>
                        {isLow ? (
                          <Badge className="bg-amber-100 text-amber-800 border-amber-200">Low Stock</Badge>
                        ) : (
                          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">In Stock</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-1.5">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 px-2 text-xs" 
                          onClick={() => handleQuickAdjust(item.id, -1)}
                        >
                          -1
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 px-2 text-xs bg-slate-50" 
                          onClick={() => handleQuickAdjust(item.id, +1)}
                        >
                          +1
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 px-2 text-xs bg-slate-50" 
                          onClick={() => handleQuickAdjust(item.id, +5)}
                        >
                          +5
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
