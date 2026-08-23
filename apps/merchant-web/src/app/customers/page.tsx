'use client';

import { useState, useEffect } from 'react';
import { createClient } from '../../lib/supabase/client';

interface Customer {
  id: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  total_orders: number;
  total_spend: number;
  created_at: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Loyalty rules configurations (mock local state for editor)
  const [pointsPerRupee, setPointsPerRupee] = useState('1');
  const [rupeesSpentValue, setRupeesSpentValue] = useState('10');
  const [redemptionThreshold, setRedemptionThreshold] = useState('100');

  const supabase = createClient();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
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
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .eq('tenant_id', member.tenant_id)
          .order('total_spend', { ascending: false });

        if (error) throw error;
        setCustomers(data || []);
      }
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(
    (c) =>
      (c.name && c.name.toLowerCase().includes(search.toLowerCase())) ||
      (c.phone && c.phone.includes(search)) ||
      (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSaveRules = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      `Loyalty rules saved:\nAccumulate: ${pointsPerRupee} point(s) per ₹${rupeesSpentValue} spent\nMin redemption: ${redemptionThreshold} points`
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">Customer Relationship & Loyalty</h1>
        <p className="text-slate-400 mt-2">Manage customer records, track values, and define loyalty reward engine configurations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Customers Directory */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm flex items-center justify-between gap-4">
            <div className="relative w-full max-w-sm">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search phone, name, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-slate-100 placeholder-slate-550 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
              />
            </div>
            <span className="text-xs text-slate-500 font-semibold shrink-0">
              {filteredCustomers.length} Profile(s) listed
            </span>
          </div>

          {/* Table list */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            {loading ? (
              <div className="p-12 text-center text-slate-400">Loading customers database...</div>
            ) : filteredCustomers.length === 0 ? (
              <div className="p-12 text-center text-slate-400">No customer profiles registered.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 text-xs font-bold uppercase tracking-wider">
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Phone contact</th>
                      <th className="px-6 py-4">Visits Count</th>
                      <th className="px-6 py-4">Total Spending</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {filteredCustomers.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-850/50 transition">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-100">{c.name || 'Anonymous Customer'}</div>
                          {c.email && <div className="text-xs text-slate-500 mt-0.5">{c.email}</div>}
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-slate-300">{c.phone || 'N/A'}</td>
                        <td className="px-6 py-4 text-slate-400">{c.total_orders} visits</td>
                        <td className="px-6 py-4 font-mono font-semibold text-slate-200">
                          ₹{Number(c.total_spend).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right column: Loyalty Rule settings */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-slate-200 mb-6 font-bold">Loyalty Points Engine</h2>

          <form onSubmit={handleSaveRules} className="space-y-4">
            <div>
              <span className="block text-xs font-semibold text-slate-300 mb-2 font-medium">
                Accumulation Rule
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={pointsPerRupee}
                  onChange={(e) => setPointsPerRupee(e.target.value)}
                  className="w-16 px-2.5 py-1.5 text-center text-sm rounded bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none"
                />
                <span className="text-xs text-slate-400">Point(s) for every spent</span>
                <input
                  type="number"
                  value={rupeesSpentValue}
                  onChange={(e) => setRupeesSpentValue(e.target.value)}
                  className="w-20 px-2.5 py-1.5 text-center text-sm rounded bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none"
                />
                <span className="text-xs text-slate-400">INR</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 font-medium">
                Minimum Redemption Threshold (Points)
              </label>
              <input
                type="number"
                value={redemptionThreshold}
                onChange={(e) => setRedemptionThreshold(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-bold transition shadow-lg shadow-sky-600/10"
            >
              Update Loyalty Engine Rules
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
