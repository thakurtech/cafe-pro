'use client';

import { useState, useEffect } from 'react';
import { createClient } from '../../lib/supabase/client';

interface Tenant {
  id: string;
  name: string;
  slug: string;
  legal_name: string | null;
  phone: string | null;
  email: string | null;
  plan_code: string;
  subscription_status: string;
  created_at: string;
}

export default function CafesPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [legalName, setLegalName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [planCode, setPlanCode] = useState('starter');
  const [subStatus, setSubStatus] = useState('trialing');
  const [formError, setFormError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTenants(data || []);
    } catch (err: any) {
      console.error('Error fetching tenants:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name || !slug) {
      setFormError('Name and Slug are required.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('tenants')
        .insert({
          name,
          slug: slug.toLowerCase().replace(/\s+/g, '-'),
          legal_name: legalName || null,
          email: email || null,
          phone: phone || null,
          plan_code: planCode,
          subscription_status: subStatus,
        })
        .select()
        .single();

      if (error) throw error;

      // Close modal and reset fields
      setModalOpen(false);
      setName('');
      setSlug('');
      setLegalName('');
      setEmail('');
      setPhone('');
      setPlanCode('starter');
      setSubStatus('trialing');
      
      // Refresh list
      fetchTenants();
    } catch (err: any) {
      setFormError(err.message || 'An error occurred.');
    }
  };

  const toggleSubscription = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      const { error } = await supabase
        .from('tenants')
        .update({ subscription_status: nextStatus })
        .eq('id', id);

      if (error) throw error;
      fetchTenants();
    } catch (err: any) {
      alert(`Error toggling subscription: ${err.message}`);
    }
  };

  const filteredTenants = tenants.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.slug.toLowerCase().includes(search.toLowerCase()) ||
      (t.email && t.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">Cafes (Tenants)</h1>
          <p className="text-slate-400 mt-2">Manage merchant brand registrations and active packages.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition shadow-lg shadow-indigo-600/10 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Register Cafe
        </button>
      </div>

      {/* Search Filter */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm flex items-center">
        <div className="relative w-full max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search cafe name, slug, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>
      </div>

      {/* Table grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading cafes catalog...</div>
        ) : filteredTenants.length === 0 ? (
          <div className="p-12 text-center text-slate-400">No cafes found. Click 'Register Cafe' to add one.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Cafe Details</th>
                  <th className="px-6 py-4">Slug</th>
                  <th className="px-6 py-4">Plan Code</th>
                  <th className="px-6 py-4">Billing Status</th>
                  <th className="px-6 py-4">Registered At</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
                {filteredTenants.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-850/50 transition">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-100">{t.name}</div>
                      {t.email && <div className="text-xs text-slate-400 mt-0.5">{t.email}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-850">
                        {t.slug}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize text-xs px-2.5 py-0.5 rounded-full font-medium bg-slate-800 text-slate-200 border border-slate-700">
                        {t.plan_code}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
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
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {new Date(t.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => toggleSubscription(t.id, t.subscription_status)}
                        className={`px-3 py-1.5 rounded text-xs font-bold transition border ${
                          t.subscription_status === 'active'
                            ? 'bg-rose-950/20 hover:bg-rose-950/40 text-rose-400 border-rose-900/30'
                            : 'bg-emerald-950/20 hover:bg-emerald-950/40 text-emerald-400 border-emerald-900/30'
                        }`}
                      >
                        {t.subscription_status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Registration Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-850 flex items-center justify-between">
              <h3 className="font-bold text-slate-100 text-lg">Register Cafe Tenant</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 transition"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateTenant} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!slug) {
                        setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                      }
                    }}
                    placeholder="Cafe Mocha"
                    className="w-full px-3 py-2 text-sm rounded bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Slug (Domain Key) *</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="cafe-mocha"
                    className="w-full px-3 py-2 text-sm rounded bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Legal Name</label>
                <input
                  type="text"
                  value={legalName}
                  onChange={(e) => setLegalName(e.target.value)}
                  placeholder="Mocha Hospitality Pvt Ltd"
                  className="w-full px-3 py-2 text-sm rounded bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Contact</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@mocha.com"
                    className="w-full px-3 py-2 text-sm rounded bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full px-3 py-2 text-sm rounded bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Pricing Plan</label>
                  <select
                    value={planCode}
                    onChange={(e) => setPlanCode(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="starter">Starter (₹499)</option>
                    <option value="growth">Growth (₹999)</option>
                    <option value="pro">Pro (₹1999)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Subscription Status</label>
                  <select
                    value={subStatus}
                    onChange={(e) => setSubStatus(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="trialing">Trialing</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              {formError && (
                <div className="p-3 rounded text-xs bg-rose-950/50 border border-rose-800 text-rose-300">
                  {formError}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-850">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-600/10"
                >
                  Register Brand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
