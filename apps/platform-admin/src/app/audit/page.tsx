'use client';

import { useState } from 'react';

interface AuditLog {
  id: string;
  actor: string;
  action: string;
  target: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export default function AuditPage() {
  const [logs] = useState<AuditLog[]>([
    { id: '1', actor: 'admin@restaurantos.com', action: 'CREATE_TENANT', target: 'Demo Cafe (demo-cafe)', details: 'Brand registered, plan default: starter, billing: trialing', ipAddress: '127.0.0.1', timestamp: '2026-08-23 15:02:12' },
    { id: '2', actor: 'admin@restaurantos.com', action: 'UPDATE_SUBSCRIPTION', target: 'Demo Cafe', details: 'Status manually overridden from trialing to active', ipAddress: '127.0.0.1', timestamp: '2026-08-23 15:05:44' },
    { id: '3', actor: 'admin@restaurantos.com', action: 'CREATE_OUTLET', target: 'Demo Cafe Main Outlet', details: 'Added new location main, active: true', ipAddress: '127.0.0.1', timestamp: '2026-08-23 15:08:18' },
    { id: '4', actor: 'admin@restaurantos.com', action: 'PROMOTE_ROLE', target: 'mukul@restaurantos.com', details: 'Assigned platform role OWNER on tenant demo-cafe', ipAddress: '192.168.1.12', timestamp: '2026-08-23 15:10:02' },
    { id: '5', actor: 'owner@demo.com', action: 'UPDATE_MENU', target: 'Product catalog', details: 'Updated selling_price of Coffee Latte from 150 to 180', ipAddress: '192.168.1.14', timestamp: '2026-08-23 15:12:10' },
  ]);

  const [search, setSearch] = useState('');

  const filteredLogs = logs.filter(
    (l) =>
      l.actor.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.target.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">Audit Logs</h1>
        <p className="text-slate-400 mt-2">Chronological ledger of configurations changes and privileged actions.</p>
      </div>

      {/* Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="relative w-full max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search actor email, action, details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Actor</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Target Scope</th>
                <th className="px-6 py-4">Log Details</th>
                <th className="px-6 py-4">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-850/50 transition">
                  <td className="px-6 py-4 text-xs font-mono text-slate-400">{log.timestamp}</td>
                  <td className="px-6 py-4 font-semibold text-slate-200">{log.actor}</td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/10">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-300">{log.target}</td>
                  <td className="px-6 py-4 text-xs text-slate-400 max-w-xs truncate" title={log.details}>
                    {log.details}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
