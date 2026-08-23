"use client";

import { useState, useEffect } from "react";
import { SearchIcon, Download, MoreHorizontal, MessageCircle, Star } from "lucide-react";
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

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock fetch
    setTimeout(() => {
      setCustomers([
        { id: '1', name: 'Rahul Kumar', phone: '+91 9876543210', orders: 12, spent: 4500, lastVisit: '2 days ago', points: 450, segment: 'Active' },
        { id: '2', name: 'Priya Sharma', phone: '+91 9876543211', orders: 2, spent: 750, lastVisit: '1 day ago', points: 75, segment: 'New' },
        { id: '3', name: 'Amit Singh', phone: '+91 9876543212', orders: 25, spent: 12400, lastVisit: '4 hours ago', points: 1240, segment: 'VIP' },
        { id: '4', name: 'Neha Gupta', phone: '+91 9876543213', orders: 5, spent: 1800, lastVisit: '3 weeks ago', points: 180, segment: 'At Risk' },
        { id: '5', name: 'Vikram Patel', phone: '+91 9876543214', orders: 8, spent: 2900, lastVisit: '2 months ago', points: 290, segment: 'Dormant' },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const getSegmentColor = (segment: string) => {
    switch(segment) {
      case 'VIP': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Active': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'New': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'At Risk': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Dormant': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Customers CRM</h2>
          <p className="text-slate-500">Track loyalty, order history, and engage with your diners.</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input className="pl-9 bg-white" placeholder="Search by name or phone number..." />
        </div>
        <Button variant="outline" className="bg-white">Segment: All</Button>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>Last Visit</TableHead>
              <TableHead>Loyalty Points</TableHead>
              <TableHead>Segment</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <div className="inline-block animate-spin w-6 h-6 border-4 border-emerald-500 border-t-transparent rounded-full" />
                </TableCell>
              </TableRow>
            ) : customers.map((customer) => (
              <TableRow key={customer.id} className="hover:bg-slate-50 cursor-pointer">
                <TableCell>
                  <div className="font-medium text-slate-900">{customer.name}</div>
                  <div className="text-sm text-slate-500">{customer.phone}</div>
                </TableCell>
                <TableCell>{customer.orders}</TableCell>
                <TableCell className="font-medium">₹{customer.spent.toLocaleString()}</TableCell>
                <TableCell className="text-sm text-slate-600">{customer.lastVisit}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Star className="w-3 h-3 text-yellow-500 mr-1 fill-yellow-500" />
                    <span className="font-medium">{customer.points}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`border ${getSegmentColor(customer.segment)}`}>
                    {customer.segment}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" title="Send message">
                    <MessageCircle className="h-4 w-4 text-blue-500" />
                  </Button>
                  <Button variant="ghost" size="icon" title="View details">
                    <MoreHorizontal className="h-4 w-4 text-slate-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-500">
          Showing 1 to 5 of 5 entries
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm" disabled>Next</Button>
        </div>
      </div>
    </div>
  );
}
