'use client';

import { useState, useEffect } from 'react';
import { createClient } from '../../lib/supabase/client';

interface Tenant {
  id: string;
  name: string;
}

interface Outlet {
  id: string;
  tenant_id: string;
  name: string;
  slug: string;
  address: any;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  tenant_name?: string;
}

export default function OutletsPage() {
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  
  // Form fields
  const [selectedTenantId, setSelectedTenantId] = useState('');
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch tenants
      const { data: tenantsData, error: tenantsErr } = await supabase
        .from('tenants')
        .select('id, name');
      
      if (tenantsErr) throw tenantsErr;
      setTenants(tenantsData || []);
      const firstTenant = tenantsData?.[0];
      if (firstTenant) {
        setSelectedTenantId(firstTenant.id);
      }

      // Fetch outlets
      const { data: outletsData, error: outletsErr } = await supabase
        .from('outlets')
        .select('*')
        .order('created_at', { ascending: false });

      if (outletsErr) throw outletsErr;

      // Join tenant names
      const tenantMap = new Map(tenantsData?.map((t) => [t.id, t.name]) || []);
      const enrichedOutlets = (outletsData || []).map((o) => ({
        ...o,
        tenant_name: tenantMap.get(o.tenant_id) || 'Unknown Brand',
      }));

      setOutlets(enrichedOutlets);
    } catch (err: any) {
      console.error('Error fetching outlets data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOutlet = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!selectedTenantId || !name || !slug) {
      setFormError('Tenant, Outlet Name, and Slug are required.');
      return;
    }

    try {
      const { error } = await supabase
        .from('outlets')
        .insert({
          tenant_id: selectedTenantId,
          name,
          slug: slug.toLowerCase().replace(/\s+/g, '-'),
          phone: phone || null,
          address: { city, state },
          is_active: true,
        });

      if (error) throw error;

      setModalOpen(false);
      setName('');
      setSlug('');
      setPhone('');
      setCity('');
      setState('');
      
      fetchData();
    } catch (err: any) {
      setFormError(err.message || 'An error occurred.');
    }
  };

  const toggleOutletActive = async (id: string, currentActive: boolean) => {
    try {
      const { error } = await supabase
        .from('outlets')
        .update({ is_active: !currentActive })
        .eq('id', id);

      if (error) throw error;
      fetchData();
    } catch (err: any) {
      alert(`Error toggling outlet status: ${err.message}`);
    }
  };

  const filteredOutlets = outlets.filter(
    (o) =>
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.slug.toLowerCase().includes(search.toLowerCase()) ||
      (o.tenant_name && o.tenant_name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">Cafe Outlets</h1>
          <p className="text-slate-400 mt-2">Manage individual brand branches and outlet properties.</p>
        </div>
        <button
          disabled={tenants.length === 0}
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-55 text-white font-semibold text-sm transition shadow-lg shadow-indigo-600/10 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Outlet Location
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
            placeholder="Search location name, brand, or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>
      </div>

      {/* Outlets Listing Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading outlets data...</div>
        ) : filteredOutlets.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            No outlets found. Register a Cafe and click 'Add Outlet Location' to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Outlet Name</th>
                  <th className="px-6 py-4">Brand Brand</th>
                  <th className="px-6 py-4">Slug Key</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Outlet Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
                {filteredOutlets.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-850/50 transition">
                    <td className="px-6 py-4 font-semibold text-slate-100">{o.name}</td>
                    <td className="px-6 py-4">{o.tenant_name}</td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-850">
                        {o.slug}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {o.address?.city ? `${o.address.city}, ${o.address.state || ''}` : 'Not Specified'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                          o.is_active
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}
                      >
                        {o.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => toggleOutletActive(o.id, o.is_active)}
                        className={`px-3 py-1.5 rounded text-xs font-bold transition border ${
                          o.is_active
                            ? 'bg-rose-950/20 hover:bg-rose-950/40 text-rose-400 border-rose-900/30'
                            : 'bg-emerald-950/20 hover:bg-emerald-950/40 text-emerald-400 border-emerald-900/30'
                        }`}
                      >
                        {o.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Creation Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-850 flex items-center justify-between">
              <h3 className="font-bold text-slate-100 text-lg">Add Outlet Location</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 transition"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateOutlet} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Cafe Brand *</label>
                <select
                  value={selectedTenantId}
                  onChange={(e) => setSelectedTenantId(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {tenants.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Outlet Location Name *</label>
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
                    placeholder="Connaught Place Branch"
                    className="w-full px-3 py-2 text-sm rounded bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Outlet Slug *</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="connaught-place"
                    className="w-full px-3 py-2 text-sm rounded bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Contact Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9999988888"
                  className="w-full px-3 py-2 text-sm rounded bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="New Delhi"
                    className="w-full px-3 py-2 text-sm rounded bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Delhi"
                    className="w-full px-3 py-2 text-sm rounded bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
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
                  Create Outlet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
