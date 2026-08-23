'use client';

import { useState, useEffect } from 'react';
import { createClient } from '../../lib/supabase/client';

interface OutletInfo {
  id: string;
  name: string;
  slug: string;
  phone: string | null;
  is_active: boolean;
  address: any;
}

interface TenantInfo {
  id: string;
  name: string;
  plan_code: string;
  subscription_status: string;
}

export default function SettingsPage() {
  const [outlet, setOutlet] = useState<OutletInfo | null>(null);
  const [tenant, setTenant] = useState<TenantInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [outletName, setOutletName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [updating, setUpdating] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: member } = await supabase
        .from('tenant_members')
        .select('tenant_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (member) {
        // Fetch Tenant
        const { data: tenantData } = await supabase
          .from('tenants')
          .select('*')
          .eq('id', member.tenant_id)
          .maybeSingle();
        
        setTenant(tenantData);

        // Fetch first outlet
        const { data: outletData } = await supabase
          .from('outlets')
          .select('*')
          .eq('tenant_id', member.tenant_id)
          .limit(1)
          .maybeSingle();

        if (outletData) {
          setOutlet(outletData);
          setOutletName(outletData.name);
          setPhone(outletData.phone || '');
          setCity(outletData.address?.city || '');
          setState(outletData.address?.state || '');
        }
      }
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!outlet) return;

    setUpdating(true);
    try {
      const { error } = await supabase
        .from('outlets')
        .update({
          name: outletName,
          phone: phone || null,
          address: { city, state },
        })
        .eq('id', outlet.id);

      if (error) throw error;
      
      alert('Settings updated successfully!');
      fetchData();
    } catch (err: any) {
      alert(`Error updating settings: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="text-center text-slate-400 py-12">Loading settings...</div>;
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">Settings</h1>
        <p className="text-slate-400 mt-2">Manage outlet configuration details, business parameters, and plan billing.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left pane: settings form */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-200 mb-6">Outlet Specifications</h2>
          
          {outlet ? (
            <form onSubmit={handleUpdateSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-medium">Outlet Name</label>
                <input
                  type="text"
                  required
                  value={outletName}
                  onChange={(e) => setOutletName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-medium">Domain slug identifier</label>
                <input
                  type="text"
                  disabled
                  value={outlet.slug}
                  className="w-full px-3 py-2 text-sm rounded bg-slate-950/50 border border-slate-805 text-slate-500 focus:outline-none cursor-not-allowed font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-medium">Contact Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-medium">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-medium">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={updating}
                className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded text-sm font-semibold transition"
              >
                {updating ? 'Saving Changes...' : 'Save Outlet Settings'}
              </button>
            </form>
          ) : (
            <p className="text-sm text-slate-500">No outlet details registered.</p>
          )}
        </div>

        {/* Right pane: billing info */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-slate-200 mb-6 font-bold">Billing & subscription</h2>
          
          {tenant ? (
            <div className="space-y-6">
              <div>
                <span className="text-xs text-slate-400 block mb-1">Active Plan Package</span>
                <span className="inline-flex px-2.5 py-1 rounded bg-slate-950 border border-slate-850 font-mono text-xs font-bold text-sky-400 uppercase tracking-wider">
                  {tenant.plan_code}
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-400 block mb-1">Account Billing Status</span>
                <span className="capitalize text-xs font-semibold text-emerald-400 block">
                  {tenant.subscription_status}
                </span>
              </div>

              <div className="border-t border-slate-800 pt-4">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold mb-2">
                  Plan pricing limits
                </span>
                <ul className="space-y-1 text-xs text-slate-400">
                  <li>&bull; Maximum 3 outlets</li>
                  <li>&bull; WhatsApp notifications</li>
                  <li>&bull; Advanced CRM features</li>
                </ul>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">No subscription record found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
