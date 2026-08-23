"use client";

import { useState, useEffect } from "react";
import { Search, SearchIcon, Filter, ExternalLink, RefreshCw, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function OrdersHistoryPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Refund state
  const [isRefundOpen, setIsRefundOpen] = useState(false);
  const [refundOrder, setRefundOrder] = useState<any>(null);
  const [refundReason, setRefundReason] = useState("");

  useEffect(() => {
    // Mock fetch
    setTimeout(() => {
      setOrders([
        { id: '1042', time: '12 Aug 2026, 14:30', items: 'Cappuccino x2, Fries', customer: 'Rahul K.', amount: 450, payment: 'UPI', type: 'POS', status: 'Completed' },
        { id: '1043', time: '12 Aug 2026, 14:15', items: 'Latte', customer: 'Guest', amount: 180, payment: 'Card', type: 'QR', status: 'Completed' },
        { id: '1044', time: '12 Aug 2026, 13:50', items: 'Burger, Coke', customer: 'Amit S.', amount: 350, payment: 'Cash', type: 'POS', status: 'Refunded' },
        { id: '1045', time: '12 Aug 2026, 13:10', items: 'Pizza', customer: 'Guest', amount: 400, payment: 'UPI', type: 'Online', status: 'Cancelled' },
        { id: '1046', time: '12 Aug 2026, 12:45', items: 'Pasta, Garlic Bread', customer: 'Priya M.', amount: 550, payment: 'UPI', type: 'POS', status: 'Completed' },
      ]);
      setLoading(false);
    }, 600);
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Completed': return 'bg-emerald-100 text-emerald-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'Refunded': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'POS': return 'bg-blue-100 text-blue-800';
      case 'QR': return 'bg-purple-100 text-purple-800';
      case 'Online': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRefund = () => {
    if (!refundReason) {
      toast.error("Please provide a reason for the refund");
      return;
    }
    
    setOrders(orders.map(o => o.id === refundOrder.id ? { ...o, status: 'Refunded' } : o));
    setIsRefundOpen(false);
    setRefundReason("");
    setRefundOrder(null);
    toast.success("Order refunded successfully");
  };

  const openRefundDialog = (order: any) => {
    setRefundOrder(order);
    setIsRefundOpen(true);
  };

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Orders History</h2>
          <p className="text-slate-500">View and manage all past transactions.</p>
        </div>
        <Button variant="outline">
          <ExternalLink className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input className="pl-9 bg-white" placeholder="Search order ID, customer..." />
        </div>
        <Button variant="outline" className="bg-white"><Filter className="mr-2 h-4 w-4" /> Filters</Button>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="h-32 text-center">
                  <div className="inline-block animate-spin w-6 h-6 border-4 border-emerald-500 border-t-transparent rounded-full" />
                </TableCell>
              </TableRow>
            ) : orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">#{order.id}</TableCell>
                <TableCell className="text-slate-500 text-sm">{order.time}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell className="max-w-[200px] truncate" title={order.items}>{order.items}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`border-none ${getTypeColor(order.type)}`}>
                    {order.type}
                  </Badge>
                </TableCell>
                <TableCell>{order.payment}</TableCell>
                <TableCell className="font-semibold">₹{order.amount}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`border-none ${getStatusColor(order.status)}`}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" title="View details">
                    <Eye className="h-4 w-4 text-slate-600" />
                  </Button>
                  {order.status === 'Completed' && (
                    <Button variant="ghost" size="icon" title="Refund" onClick={() => openRefundDialog(order)}>
                      <RefreshCw className="h-4 w-4 text-orange-500" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isRefundOpen} onOpenChange={setIsRefundOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Refund Order #{refundOrder?.id}</DialogTitle>
            <DialogDescription>
              Process a full refund for this order. The customer paid ₹{refundOrder?.amount} via {refundOrder?.payment}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Reason for Refund <span className="text-red-500">*</span></label>
              <Input 
                placeholder="e.g. Item missing, Customer unhappy, Accidental charge..." 
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRefundOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleRefund}>Process Full Refund</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
