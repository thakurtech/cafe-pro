"use client";

import { useState, useEffect, useRef } from "react";
import { Clock, Volume2, VolumeX, CheckCircle2, PlayCircle, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Mock Data
const INITIAL_ORDERS = [
  { id: '1048', time: Date.now() - 120000, items: [{name: 'Margherita Pizza', qty: 1}, {name: 'Coke', qty: 2}], type: 'Dine-in', table: 'T-4', status: 'NEW' },
  { id: '1047', time: Date.now() - 300000, items: [{name: 'Cappuccino', qty: 2}, {name: 'Veg Burger', qty: 2}], type: 'Takeaway', table: null, status: 'PREPARING' },
  { id: '1046', time: Date.now() - 600000, items: [{name: 'Pasta Alfredo', qty: 1}], type: 'Dine-in', table: 'T-2', status: 'PREPARING' },
];

export default function KitchenDisplaySystem() {
  const [orders, setOrders] = useState<any[]>(INITIAL_ORDERS);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const playBeep = () => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.log("Audio play blocked", e);
    }
  };

  // Simulate new order arriving every 20s
  useEffect(() => {
    const interval = setInterval(() => {
      const newOrder = {
        id: Math.floor(Math.random() * 9000 + 1000).toString(),
        time: Date.now(),
        items: [{name: 'French Fries', qty: 1}, {name: 'Cold Coffee', qty: 1}],
        type: 'Online',
        table: null,
        status: 'NEW'
      };
      setOrders(prev => [newOrder, ...prev]);
      playBeep();
    }, 20000);
    return () => clearInterval(interval);
  }, [soundEnabled]);

  const updateStatus = (id: string, newStatus: string) => {
    if (newStatus === 'COMPLETED') {
      setOrders(prev => prev.filter(o => o.id !== id));
    } else {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    }
  };

  const getElapsedTime = (timestamp: number) => {
    const diff = Math.floor((currentTime.getTime() - timestamp) / 1000);
    const mins = Math.floor(diff / 60);
    const secs = diff % 60;
    return { mins, secs, isLate: mins >= 10, isWarning: mins >= 5 };
  };

  const newOrders = orders.filter(o => o.status === 'NEW');
  const prepOrders = orders.filter(o => o.status === 'PREPARING');
  const readyOrders = orders.filter(o => o.status === 'READY');

  const OrderCard = ({ order }: { order: any }) => {
    const time = getElapsedTime(order.time);
    
    return (
      <div className={`rounded-xl border-2 p-4 shadow-lg transition-all ${
        time.isLate ? 'bg-red-950 border-red-500' : 
        time.isWarning ? 'bg-amber-950 border-amber-500' : 
        'bg-[#1a1a2e] border-slate-700'
      }`}>
        <div className="flex justify-between items-start mb-3 pb-3 border-b border-white/10">
          <div>
            <h3 className="text-2xl font-black text-white">#{order.id}</h3>
            <div className="flex gap-2 mt-1">
              <Badge variant="outline" className="text-slate-300 border-slate-600 bg-slate-800">
                {order.type}
              </Badge>
              {order.table && (
                <Badge variant="outline" className="text-amber-400 border-amber-700 bg-amber-900/30">
                  {order.table}
                </Badge>
              )}
            </div>
          </div>
          <div className={`text-xl font-bold font-mono px-3 py-1 rounded-lg ${
            time.isLate ? 'bg-red-600 text-white animate-pulse' : 
            time.isWarning ? 'bg-amber-600 text-white' : 
            'bg-slate-800 text-emerald-400'
          }`}>
            {time.mins}:{time.secs.toString().padStart(2, '0')}
          </div>
        </div>

        <ul className="space-y-3 mb-6 min-h-[120px]">
          {order.items.map((item: any, i: number) => (
            <li key={i} className="flex items-start text-lg text-slate-200">
              <span className="font-black bg-slate-800 text-white w-8 h-8 flex items-center justify-center rounded mr-3 shrink-0">
                {item.qty}x
              </span>
              <span className="font-medium leading-tight pt-1">{item.name}</span>
            </li>
          ))}
        </ul>

        {order.status === 'NEW' && (
          <Button 
            className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white" 
            onClick={() => updateStatus(order.id, 'PREPARING')}
          >
            <PlayCircle className="mr-2 h-6 w-6" /> Start Preparing
          </Button>
        )}
        
        {order.status === 'PREPARING' && (
          <Button 
            className="w-full h-14 text-lg font-bold bg-amber-600 hover:bg-amber-700 text-white" 
            onClick={() => updateStatus(order.id, 'READY')}
          >
            <CheckCircle2 className="mr-2 h-6 w-6" /> Mark Ready
          </Button>
        )}

        {order.status === 'READY' && (
          <Button 
            className="w-full h-14 text-lg font-bold bg-emerald-600 hover:bg-emerald-700 text-white" 
            onClick={() => updateStatus(order.id, 'COMPLETED')}
          >
            <CheckCircle2 className="mr-2 h-6 w-6" /> Complete & Clear
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-[#0f0f1a] text-white overflow-hidden">
      {/* Header */}
      <header className="h-16 bg-[#1a1a2e] border-b border-slate-800 flex items-center justify-between px-6 shrink-0 shadow-md">
        <div className="flex items-center">
          <h1 className="text-2xl font-black text-emerald-400 tracking-tight">KITCHEN DISPLAY</h1>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="text-xl font-bold font-mono tracking-wider text-slate-300">
            {currentTime.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: '2-digit', second: '2-digit' })}
          </div>
          <Button 
            variant="outline" 
            size="sm"
            className={`border-slate-600 ${soundEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) {
                // Initialize audio context on user gesture
                try {
                  audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
                } catch(e) {}
              }
            }}
          >
            {soundEnabled ? <Volume2 className="h-5 w-5 mr-2" /> : <VolumeX className="h-5 w-5 mr-2" />}
            Sound {soundEnabled ? 'ON' : 'OFF'}
          </Button>
        </div>
      </header>

      {/* Main KDS Columns */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 p-6 overflow-hidden">
        
        {/* NEW ORDERS */}
        <div className="flex flex-col overflow-hidden bg-slate-900/50 rounded-2xl border border-slate-800">
          <div className="p-4 bg-blue-900/30 border-b border-blue-900/50 flex justify-between items-center shrink-0">
            <h2 className="text-xl font-bold text-blue-400">NEW ORDERS</h2>
            <Badge className="bg-blue-600 text-white text-lg px-3">{newOrders.length}</Badge>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {newOrders.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-600">
                <CheckCircle2 className="w-12 h-12 mb-2 opacity-20" />
                <p>No new orders</p>
              </div>
            ) : (
              newOrders.map(order => <OrderCard key={order.id} order={order} />)
            )}
          </div>
        </div>

        {/* PREPARING */}
        <div className="flex flex-col overflow-hidden bg-slate-900/50 rounded-2xl border border-slate-800">
          <div className="p-4 bg-amber-900/30 border-b border-amber-900/50 flex justify-between items-center shrink-0">
            <h2 className="text-xl font-bold text-amber-400">PREPARING</h2>
            <Badge className="bg-amber-600 text-white text-lg px-3">{prepOrders.length}</Badge>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {prepOrders.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-600">
                <p>Kitchen is clear</p>
              </div>
            ) : (
              prepOrders.map(order => <OrderCard key={order.id} order={order} />)
            )}
          </div>
        </div>

        {/* READY */}
        <div className="flex flex-col overflow-hidden bg-slate-900/50 rounded-2xl border border-slate-800">
          <div className="p-4 bg-emerald-900/30 border-b border-emerald-900/50 flex justify-between items-center shrink-0">
            <h2 className="text-xl font-bold text-emerald-400">READY</h2>
            <Badge className="bg-emerald-600 text-white text-lg px-3">{readyOrders.length}</Badge>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {readyOrders.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-600">
                <p>No ready orders</p>
              </div>
            ) : (
              readyOrders.map(order => <OrderCard key={order.id} order={order} />)
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
