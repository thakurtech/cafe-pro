"use client";

import { useState } from "react";
import { UserCircle, UserPlus, Shield, Clock, IndianRupee, Lock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "MANAGER" | "CASHIER" | "CHEF" | "CAPTAIN";
  status: "ACTIVE" | "OFF_SHIFT";
  currentShiftStart?: string;
}

const INITIAL_STAFF: StaffMember[] = [
  { id: "st-1", name: "Arjun Mehta", email: "owner@cafenoir.com", phone: "+91 98765 43210", role: "MANAGER", status: "ACTIVE", currentShiftStart: "08:30 AM" },
  { id: "st-2", name: "Rohan Verma", email: "rohan.pos@cafenoir.com", phone: "+91 98123 45678", role: "CASHIER", status: "ACTIVE", currentShiftStart: "09:00 AM" },
  { id: "st-3", name: "Chef Manpreet", email: "kitchen@cafenoir.com", phone: "+91 98987 65432", role: "CHEF", status: "ACTIVE", currentShiftStart: "08:00 AM" },
  { id: "st-4", name: "Priya Sharma", email: "priya@cafenoir.com", phone: "+91 97777 88888", role: "CAPTAIN", status: "OFF_SHIFT" },
];

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>(INITIAL_STAFF);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    phone: "",
    role: "CASHIER" as "MANAGER" | "CASHIER" | "CHEF" | "CAPTAIN",
    password: ""
  });

  const [activeShift, setActiveShift] = useState({
    isOpen: true,
    cashierName: "Rohan Verma",
    startedAt: "Today, 09:00 AM",
    openingCash: 2500,
    cashOrdersTotal: 4850,
    upiOrdersTotal: 8400,
  });

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.phone) return;

    const member: StaffMember = {
      id: `st-${Date.now()}`,
      name: newStaff.name,
      email: newStaff.email,
      phone: newStaff.phone,
      role: newStaff.role,
      status: "ACTIVE",
      currentShiftStart: "Just now"
    };

    setStaff([...staff, member]);
    setIsAddOpen(false);
    setNewStaff({ name: "", email: "", phone: "", role: "CASHIER", password: "" });
    toast.success(`Staff account for ${member.name} (${member.role}) created!`);
  };

  const handleCloseShift = () => {
    toast.success("Cashier shift reconciled & closed! EOD report generated.");
  };

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Staff & Shift Management</h2>
          <p className="text-slate-500">Manage employee permissions, POS logins, and register cash drawer balancing.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <UserPlus className="w-4 h-4 mr-2" /> Add Staff Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px]">
            <form onSubmit={handleAddStaff}>
              <DialogHeader>
                <DialogTitle>Add Staff / Operator</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-1.5">
                  <Label htmlFor="sname">Full Name</Label>
                  <Input 
                    id="sname" 
                    placeholder="e.g. Sumanth Rao" 
                    value={newStaff.name} 
                    onChange={e => setNewStaff({ ...newStaff, name: e.target.value })} 
                    required 
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="sphone">Mobile Number</Label>
                  <Input 
                    id="sphone" 
                    placeholder="+91 98765 00000" 
                    value={newStaff.phone} 
                    onChange={e => setNewStaff({ ...newStaff, phone: e.target.value })} 
                    required 
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="semail">Email Address</Label>
                  <Input 
                    id="semail" 
                    type="email" 
                    placeholder="operator@cafenoir.com" 
                    value={newStaff.email} 
                    onChange={e => setNewStaff({ ...newStaff, email: e.target.value })} 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="srole">Assigned Role</Label>
                    <select 
                      id="srole"
                      value={newStaff.role}
                      onChange={e => setNewStaff({ ...newStaff, role: e.target.value as any })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    >
                      <option value="CASHIER">Cashier (POS)</option>
                      <option value="CHEF">Chef (Kitchen KDS)</option>
                      <option value="CAPTAIN">Captain / Waiter</option>
                      <option value="MANAGER">Manager (Full Ops)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="spass">PIN / Password</Label>
                    <Input 
                      id="spass" 
                      type="password" 
                      placeholder="••••" 
                      value={newStaff.password} 
                      onChange={e => setNewStaff({ ...newStaff, password: e.target.value })} 
                      required 
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">Save Account</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Cash Drawer & Shift Summary */}
      <Card className="border-indigo-100 bg-gradient-to-r from-slate-900 to-indigo-950 text-white">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-400" /> Active Register Shift
              </CardTitle>
              <CardDescription className="text-slate-300">
                Cashier: {activeShift.cashierName} • Started: {activeShift.startedAt}
              </CardDescription>
            </div>
            <Badge className="bg-emerald-500 text-white font-semibold">Active Session</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-4 pb-4">
            <div className="p-3 bg-white/5 rounded-lg border border-white/10">
              <p className="text-xs text-slate-400">Opening Cash Float</p>
              <p className="text-xl font-bold text-white mt-1">₹{activeShift.openingCash.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-white/5 rounded-lg border border-white/10">
              <p className="text-xs text-slate-400">Cash Collected Today</p>
              <p className="text-xl font-bold text-emerald-400 mt-1">₹{activeShift.cashOrdersTotal.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-white/5 rounded-lg border border-white/10">
              <p className="text-xs text-slate-400">UPI / QR Collected</p>
              <p className="text-xl font-bold text-indigo-300 mt-1">₹{activeShift.upiOrdersTotal.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-white/5 rounded-lg border border-white/10">
              <p className="text-xs text-slate-400">Expected Drawer Cash</p>
              <p className="text-xl font-bold text-amber-300 mt-1">₹{(activeShift.openingCash + activeShift.cashOrdersTotal).toLocaleString()}</p>
            </div>
          </div>
          <div className="flex justify-end pt-2 border-t border-white/10">
            <Button onClick={handleCloseShift} variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-0">
              End Shift & Print Day-End Z-Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Staff Table */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members & Access Levels</CardTitle>
          <CardDescription>Granular role-based permissions control what staff can view and modify.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Current Status</TableHead>
                  <TableHead>Shift Timing</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-semibold text-slate-900 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
                        {s.name.charAt(0)}
                      </div>
                      {s.name}
                    </TableCell>
                    <TableCell className="text-xs text-slate-600">
                      <div>{s.phone}</div>
                      <div className="text-slate-400">{s.email}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs">
                        {s.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {s.status === "ACTIVE" ? (
                        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">On Duty</Badge>
                      ) : (
                        <Badge className="bg-slate-100 text-slate-600 border-slate-200">Off Shift</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">
                      {s.currentShiftStart || "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-xs text-indigo-600 hover:text-indigo-800"
                        onClick={() => toast.info(`Permissions for ${s.name} configured.`)}
                      >
                        Permissions
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
