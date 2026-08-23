'use client';

import { useState, useEffect } from 'react';

export default function SystemPage() {
  const [metrics, setMetrics] = useState({
    cpu: 24,
    memory: 56,
    dbConnections: 12,
    diskSpace: 18,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      // Simulate real-time dashboard oscillation
      setMetrics((prev) => ({
        cpu: Math.max(10, Math.min(95, prev.cpu + (Math.random() * 10 - 5))),
        memory: Math.max(40, Math.min(85, prev.memory + (Math.random() * 2 - 1))),
        dbConnections: Math.max(5, Math.min(45, prev.dbConnections + Math.floor(Math.random() * 3 - 1))),
        diskSpace: prev.diskSpace,
      }));
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const dbTables = [
    { name: 'public.orders', rows: '1,412', size: '2.4 MB' },
    { name: 'public.order_items', rows: '4,896', size: '5.8 MB' },
    { name: 'public.customers', rows: '812', size: '412 KB' },
    { name: 'public.products', rows: '184', size: '128 KB' },
    { name: 'public.tenants', rows: '6', size: '32 KB' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">System Metrics</h1>
        <p className="text-slate-400 mt-2">Core node metrics, memory load, and database physical allocations.</p>
      </div>

      {/* Real-time stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* CPU */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 block mb-2">CPU Utilization</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-100">{metrics.cpu.toFixed(0)}%</span>
            <span className="text-xs text-emerald-400 font-medium">Normal</span>
          </div>
          <div className="w-full bg-slate-950 h-2 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-indigo-500 h-full rounded-full transition-all duration-1000"
              style={{ width: `${metrics.cpu}%` }}
            ></div>
          </div>
        </div>

        {/* RAM */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 block mb-2">Memory (RAM) Load</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-100">{metrics.memory.toFixed(0)}%</span>
            <span className="text-xs text-slate-500">1.8GB / 3.2GB</span>
          </div>
          <div className="w-full bg-slate-950 h-2 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-sky-500 h-full rounded-full transition-all duration-1000"
              style={{ width: `${metrics.memory}%` }}
            ></div>
          </div>
        </div>

        {/* Database Connections */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 block mb-2">Active DB Pools</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-100">{metrics.dbConnections}</span>
            <span className="text-xs text-emerald-400 font-medium">Under limit</span>
          </div>
          <div className="w-full bg-slate-950 h-2 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
              style={{ width: `${(metrics.dbConnections / 50) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Disk Space */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 block mb-2">DB Disk Space</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-100">{metrics.diskSpace}%</span>
            <span className="text-xs text-slate-500">1.8 GB of 10 GB</span>
          </div>
          <div className="w-full bg-slate-950 h-2 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-1000"
              style={{ width: `${metrics.diskSpace}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Database breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-850">
          <h2 className="text-lg font-bold text-slate-200">PostgreSQL Physical Allocations</h2>
          <p className="text-xs text-slate-400 mt-1">Active schemas row counts and data footprints.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Database Table</th>
                <th className="px-6 py-4">Est. Row Count</th>
                <th className="px-6 py-4">Footprint Size</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {dbTables.map((t) => (
                <tr key={t.name} className="hover:bg-slate-850/50 transition">
                  <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-200">{t.name}</td>
                  <td className="px-6 py-4 font-mono text-xs">{t.rows}</td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-400">{t.size}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
