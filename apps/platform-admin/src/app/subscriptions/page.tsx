'use client';

import { useState, useEffect } from 'react';
import { createClient } from '../../lib/supabase/client';

interface Tenant {
  id: string;
  name: string;
  plan_code: string;
  subscription_status: string;
  email: string | null;
}

export default function SubscriptionsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [newPlan, setNewPlan] = useState('');
  const [newStatus, setNewStatus] = useState('');

  const supabase = createClient();

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('id, name, plan_code, subscription_status, email')
        .order('name');
      if (error) throw error;
      setTenants(data || []);
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTenant) return;

    try {
      const { error } = await supabase
        .from('tenants')
        .update({
          plan_code: newPlan,
          subscription_status: newStatus,
        })
        .eq('id', editingTenant.id);

      if (error) throw error;
      
      setEditingTenant(null);
      fetchTenants();
    } catch (err: any) {
      alert(`Error updating subscription: ${err.message}`);
    }
  };

  const plans = [
    { code: 'starter', name: 'Starter', price: '₹499/mo', features: ['1 Outlet limit', 'Core POS capabilities', 'Standard reports'] },
    { code: 'growth', name: 'Growth', price: '₹999/mo', features: ['3 Outlets limit', 'Advanced loyalty rules', 'WhatsApp marketing campaigns'] },
    { code: 'pro', name: 'Pro', price: '₹1,999/mo', features: ['Unlimited outlets', 'Custom loyalty integrations', 'Full analytics & margins reporting'] },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">Subscription Plans</h1>
        <p className="text-slate-400 mt-2">Configure core package limits, adjust pricing, or override merchant plans.</p>
      </div>

      {/* Plan Tiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => (
          <div key={p.code} className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-100">{p.name}</h3>
                <span className="font-mono text-xs font-bold text-indigo-400 uppercase tracking-wider bg-indigo-500/5 px-2.5 py-1 rounded-full border border-indigo-500/10">
                  {p.code}
                </span>
              </div>
              <div className="text-2xl font-extrabold text-slate-100 mb-6">{p.price}</div>
              <ul className="space-y-2.5 text-xs text-slate-400">
                {p.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Tenant Override Console */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-850">
          <h2 className="text-lg font-bold text-slate-200">Merchant subscription overrides</h2>
          <p className="text-xs text-slate-400 mt-1">Manual overrides for subscription limits or statuses.</p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading plan registry...</div>
        ) : tenants.length === 0 ? (
          <div className="p-12 text-center text-slate-400">No active cafe tenants registered.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Tenant Brand</th>
                  <th className="px-6 py-4">Active Plan</th>
                  <th className="px-6 py-4">Billing Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {tenants.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-850/50 transition">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-100">{t.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{t.email || 'No email contact'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize text-xs font-semibold px-2.5 py-1 bg-slate-950 border border-slate-850 text-slate-200 rounded">
                        {t.plan_code}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                          t.subscription_status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : t.subscription_status === 'trialing'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}
                      >
                        {t.subscription_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setEditingTenant(t);
                          setNewPlan(t.plan_code);
                          setNewStatus(t.subscription_status);
                        }}
                        className="px-3 py-1.5 rounded text-xs font-bold bg-indigo-950/20 hover:bg-indigo-950/40 text-indigo-400 border border-indigo-900/30 transition"
                      >
                        Override Plan
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Override Modal */}
      {editingTenant && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-850 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-100 text-base">Subscription Override</h3>
                <span className="text-xs text-slate-400 mt-1 block">{editingTenant.name}</span>
              </div>
              <button
                onClick={() => setEditingTenant(null)}
                className="text-slate-400 hover:text-slate-200 transition"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpdateSubscription} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Assign Package Tier</label>
                <select
                  value={newPlan}
                  onChange={(e) => setNewPlan(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="starter">Starter Plan (₹499)</option>
                  <option value="growth">Growth Plan (₹999)</option>
                  <option value="pro">Pro Plan (₹1,999)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Billing Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="trialing">Trialing</option>
                  <option value="active">Active Billing</option>
                  <option value="unpaid">Unpaid / Past Due</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-850">
                <button
                  type="button"
                  onClick={() => setEditingTenant(null)}
                  className="px-4 py-2 rounded text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-600/10"
                >
                  Apply Override
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
