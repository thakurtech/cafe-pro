'use client';

import { useState } from 'react';

interface IntegrationSetting {
  id: string;
  name: string;
  category: string;
  enabled: boolean;
  description: string;
}

export default function MerchantIntegrationsPage() {
  const [settings, setSettings] = useState<IntegrationSetting[]>([
    { id: 'razorpay', name: 'Razorpay Gateway', category: 'Payments Gateway', enabled: true, description: 'Accept online UPI, Cards, and Netbanking on guest QR orders.' },
    { id: 'whatsapp', name: 'WhatsApp Updates', category: 'Customer Notifications', enabled: false, description: 'Send automated order status alerts and digital receipts to customer mobiles.' },
    { id: 'sms', name: 'Twilio SMS Gateway', category: 'Customer Notifications', enabled: true, description: 'Alternative SMS delivery for receipts and loyalty alerts.' },
    { id: 'swiggy', name: 'Swiggy Integrator', category: 'Food Aggregators', enabled: false, description: 'Sync catalog items and receive delivery orders directly in POS.' },
    { id: 'zomato', name: 'Zomato Integrator', category: 'Food Aggregators', enabled: false, description: 'Sync catalog items and receive delivery orders directly in POS.' },
  ]);

  const [savingId, setSavingId] = useState<string | null>(null);

  const handleToggle = async (id: string, currentEnabled: boolean) => {
    setSavingId(id);
    // Simulate API connection verification
    await new Promise((resolve) => setTimeout(resolve, 800));

    setSettings((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, enabled: !currentEnabled };
        }
        return item;
      })
    );
    setSavingId(null);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">Integrations</h1>
        <p className="text-slate-400 mt-2">Connect external order channels, payment processors, and communications webhooks.</p>
      </div>

      {/* List Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-850">
          <h3 className="font-bold text-slate-200 text-sm">Active Channels & Gateways</h3>
          <span className="text-xs text-slate-500">Enable or disable third-party tools</span>
        </div>

        <div className="divide-y divide-slate-800">
          {settings.map((item) => (
            <div key={item.id} className="p-6 flex items-center justify-between gap-6 hover:bg-slate-850/20 transition">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-100 text-sm">{item.name}</h4>
                  <span className="font-mono text-[9px] uppercase font-bold text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-850">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-slate-400 max-w-xl">{item.description}</p>
              </div>

              <div>
                <button
                  onClick={() => handleToggle(item.id, item.enabled)}
                  disabled={savingId !== null}
                  className={`px-4 py-2 rounded text-xs font-bold transition border ${
                    item.enabled
                      ? 'bg-sky-950/20 hover:bg-sky-950/40 text-sky-400 border-sky-900/30'
                      : 'bg-slate-800 hover:bg-slate-750 text-slate-400 border-slate-700'
                  }`}
                >
                  {savingId === item.id ? 'Connecting...' : item.enabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
