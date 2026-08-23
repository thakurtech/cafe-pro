'use client';

import { useState } from 'react';

interface Integration {
  id: string;
  name: string;
  category: string;
  status: 'online' | 'degraded' | 'offline';
  latency: string;
  errorCount: number;
  lastChecked: string;
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    { id: '1', name: 'Razorpay PG API', category: 'Payments Gateway', status: 'online', latency: '124ms', errorCount: 0, lastChecked: 'Just Now' },
    { id: '2', name: 'Stripe Gateway', category: 'Payments Gateway', status: 'online', latency: '186ms', errorCount: 0, lastChecked: '1 min ago' },
    { id: '3', name: 'Twilio SMS Server', category: 'Communications', status: 'online', latency: '98ms', errorCount: 0, lastChecked: 'Just Now' },
    { id: '4', name: 'WhatsApp Business API', category: 'Communications', status: 'degraded', latency: '412ms', errorCount: 4, lastChecked: '3 mins ago' },
    { id: '5', name: 'Firebase Cloud Messaging', category: 'Push Notifications', status: 'online', latency: '82ms', errorCount: 0, lastChecked: '5 mins ago' },
  ]);

  const [testingId, setTestingId] = useState<string | null>(null);

  const handleTestConnection = async (id: string) => {
    setTestingId(id);
    // Simulate active API ping delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIntegrations((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: 'online',
            latency: `${Math.floor(Math.random() * 100) + 50}ms`,
            errorCount: 0,
            lastChecked: 'Just Now',
          };
        }
        return item;
      })
    );
    setTestingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">Integration Health</h1>
        <p className="text-slate-400 mt-2">Monitor SMS, WhatsApp, and Payment gateway external API links.</p>
      </div>

      {/* Health aggregate panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-500/10 text-amber-400 flex items-center justify-center rounded-xl border border-amber-500/20">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-slate-200 text-base">Minor Service Degradation</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              WhatsApp APIs are experiencing latency spikes. Payments gateways and SMS routes are operational.
            </p>
          </div>
        </div>
      </div>

      {/* Integrations Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Integration Provider</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Latency</th>
                <th className="px-6 py-4">Recent Errors</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {integrations.map((item) => (
                <tr key={item.id} className="hover:bg-slate-850/50 transition">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-100">{item.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">Checked {item.lastChecked}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-400">{item.category}</td>
                  <td className="px-6 py-4 font-mono text-xs">{item.latency}</td>
                  <td className="px-6 py-4">
                    {item.errorCount > 0 ? (
                      <span className="text-xs text-rose-400 font-semibold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                        {item.errorCount} errors
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500">None</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                        item.status === 'online'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : item.status === 'degraded'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}
                    >
                      {item.status === 'online' ? 'Operational' : item.status === 'degraded' ? 'Degraded' : 'Offline'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleTestConnection(item.id)}
                      disabled={testingId !== null}
                      className="px-3 py-1.5 rounded text-xs font-bold bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 transition disabled:opacity-50"
                    >
                      {testingId === item.id ? 'Testing...' : 'Test Connection'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
