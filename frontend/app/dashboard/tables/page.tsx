"use client";

import { useState, useEffect } from "react";
import { Plus, LayoutGrid, Download, QrCode, Trash2, Edit2, Info, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle 
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type TableStatus = 'AVAILABLE' | 'OCCUPIED' | 'CLEANING' | 'RESERVED';

interface Table {
  id: string;
  name: string;
  capacity: number;
  status: TableStatus;
}

export default function TablesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  
  // Add Table Form
  const [newTableName, setNewTableName] = useState("");
  const [newTableCapacity, setNewTableCapacity] = useState("4");
  
  // Bulk Add Form
  const [bulkCount, setBulkCount] = useState("5");

  const shopSlug = "demo-shop"; // Replace with dynamic slug from state/context

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setTables([
          { id: '1', name: 'Table 1', capacity: 2, status: 'AVAILABLE' },
          { id: '2', name: 'Table 2', capacity: 2, status: 'OCCUPIED' },
          { id: '3', name: 'Table 3', capacity: 4, status: 'CLEANING' },
          { id: '4', name: 'Table 4', capacity: 4, status: 'AVAILABLE' },
          { id: '5', name: 'Table 5', capacity: 6, status: 'RESERVED' },
          { id: '6', name: 'Table 6', capacity: 8, status: 'AVAILABLE' },
        ]);
        setLoading(false);
      }, 500);
    } catch (error) {
      toast.error("Failed to load tables");
      setLoading(false);
    }
  };

  const getStatusColor = (status: TableStatus) => {
    switch(status) {
      case 'AVAILABLE': return 'bg-emerald-100 border-emerald-300 text-emerald-800';
      case 'OCCUPIED': return 'bg-red-100 border-red-300 text-red-800';
      case 'CLEANING': return 'bg-amber-100 border-amber-300 text-amber-800';
      case 'RESERVED': return 'bg-purple-100 border-purple-300 text-purple-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const updateTableStatus = (id: string, status: TableStatus) => {
    setTables(tables.map(t => t.id === id ? { ...t, status } : t));
    if (selectedTable && selectedTable.id === id) {
      setSelectedTable({ ...selectedTable, status });
    }
    toast.success(`Table marked as ${status.toLowerCase()}`);
  };

  const handleAddTable = () => {
    if (!newTableName) return;
    const newTable: Table = {
      id: Math.random().toString(),
      name: newTableName,
      capacity: parseInt(newTableCapacity),
      status: 'AVAILABLE'
    };
    setTables([...tables, newTable]);
    setIsAddOpen(false);
    setNewTableName("");
    toast.success("Table added successfully");
  };

  const handleBulkAdd = () => {
    const count = parseInt(bulkCount);
    if (isNaN(count) || count <= 0) return;
    
    const newTables: Table[] = Array.from({ length: count }).map((_, i) => ({
      id: Math.random().toString(),
      name: `Table ${tables.length + i + 1}`,
      capacity: 4,
      status: 'AVAILABLE'
    }));
    
    setTables([...tables, ...newTables]);
    setIsBulkOpen(false);
    toast.success(`${count} tables added successfully`);
  };

  const handleDeleteTable = (id: string) => {
    setTables(tables.filter(t => t.id !== id));
    setSelectedTable(null);
    toast.success("Table deleted");
  };

  const qrUrl = selectedTable ? `${window.location.origin}/shop/${shopSlug}/table/${selectedTable.id}` : '';
  const qrImageSrc = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrUrl)}&margin=10`;

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Tables & Floor Plan</h2>
          <p className="text-slate-500">Manage your restaurant layout and QR codes.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setIsBulkOpen(true)}>
            <LayoutGrid className="mr-2 h-4 w-4" /> Bulk Add
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setIsAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Table
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {tables.map(table => (
            <Card 
              key={table.id} 
              className={`cursor-pointer transition-all hover:scale-105 border-2 ${getStatusColor(table.status)}`}
              onClick={() => setSelectedTable(table)}
            >
              <CardContent className="p-4 flex flex-col items-center justify-center aspect-square text-center">
                <h3 className="font-bold text-lg mb-1">{table.name}</h3>
                <div className="flex items-center text-xs opacity-80 mb-2">
                  <Users className="w-3 h-3 mr-1" /> {table.capacity} Seats
                </div>
                <Badge variant="outline" className="bg-white/50 border-none font-semibold text-[10px]">
                  {table.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Table Side Panel */}
      <Sheet open={!!selectedTable} onOpenChange={(open) => !open && setSelectedTable(null)}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          {selectedTable && (
            <>
              <SheetHeader className="mb-6">
                <div className="flex items-center justify-between">
                  <SheetTitle className="text-2xl font-bold">{selectedTable.name}</SheetTitle>
                  <Badge className={getStatusColor(selectedTable.status)}>{selectedTable.status}</Badge>
                </div>
                <SheetDescription>
                  Capacity: {selectedTable.capacity} persons
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6">
                {/* Actions based on status */}
                <div className="grid grid-cols-2 gap-3">
                  {selectedTable.status === 'AVAILABLE' && (
                    <>
                      <Button className="w-full bg-red-600 hover:bg-red-700" onClick={() => updateTableStatus(selectedTable.id, 'OCCUPIED')}>
                        Mark Occupied
                      </Button>
                      <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => updateTableStatus(selectedTable.id, 'RESERVED')}>
                        Reserve
                      </Button>
                    </>
                  )}
                  
                  {selectedTable.status === 'OCCUPIED' && (
                    <>
                      <Button className="w-full bg-amber-600 hover:bg-amber-700" onClick={() => updateTableStatus(selectedTable.id, 'CLEANING')}>
                        Mark Cleaning
                      </Button>
                      <Button className="w-full" variant="outline">
                        View Order
                      </Button>
                    </>
                  )}

                  {selectedTable.status === 'CLEANING' && (
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 col-span-2" onClick={() => updateTableStatus(selectedTable.id, 'AVAILABLE')}>
                      Mark Available
                    </Button>
                  )}

                  {selectedTable.status === 'RESERVED' && (
                    <>
                      <Button className="w-full bg-red-600 hover:bg-red-700" onClick={() => updateTableStatus(selectedTable.id, 'OCCUPIED')}>
                        Customer Arrived
                      </Button>
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={() => updateTableStatus(selectedTable.id, 'AVAILABLE')}>
                        Cancel
                      </Button>
                    </>
                  )}
                </div>

                <hr />

                {/* QR Code Section */}
                <div className="flex flex-col items-center bg-slate-50 p-6 rounded-lg border border-slate-100">
                  <h4 className="font-semibold mb-4 text-slate-700 flex items-center">
                    <QrCode className="mr-2 w-5 h-5" /> Order QR Code
                  </h4>
                  <div className="bg-white p-4 rounded-xl shadow-sm mb-4 border">
                    <img src={qrImageSrc} alt={`QR Code for ${selectedTable.name}`} className="w-40 h-40" />
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => {
                    const link = document.createElement('a');
                    link.href = qrImageSrc;
                    link.download = `QR_${selectedTable.name}.png`;
                    link.click();
                  }}>
                    <Download className="mr-2 w-4 h-4" /> Download QR
                  </Button>
                </div>

                <hr />

                {/* Management Actions */}
                <div className="flex gap-3">
                  <Button variant="secondary" className="flex-1">
                    <Edit2 className="w-4 h-4 mr-2" /> Edit Info
                  </Button>
                  <Button variant="destructive" className="flex-1" onClick={() => handleDeleteTable(selectedTable.id)}>
                    <Trash2 className="w-4 h-4 mr-2" /> Delete Table
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Add Table Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Table</DialogTitle>
            <DialogDescription>Create a single table with specific details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Table Name</Label>
              <Input placeholder="e.g. Table 1, Window 1" value={newTableName} onChange={e => setNewTableName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Capacity (Seats)</Label>
              <Input type="number" min="1" value={newTableCapacity} onChange={e => setNewTableCapacity(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleAddTable}>Save Table</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Add Dialog */}
      <Dialog open={isBulkOpen} onOpenChange={setIsBulkOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Add Tables</DialogTitle>
            <DialogDescription>Quickly generate multiple sequential tables.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>How many tables to add?</Label>
              <Input type="number" min="1" max="50" value={bulkCount} onChange={e => setBulkCount(e.target.value)} />
            </div>
            <div className="bg-blue-50 text-blue-800 p-3 rounded text-sm flex items-start">
              <Info className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
              This will create {bulkCount || 0} tables starting with "Table {tables.length + 1}". You can edit their names later.
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBulkOpen(false)}>Cancel</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleBulkAdd}>Generate Tables</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
