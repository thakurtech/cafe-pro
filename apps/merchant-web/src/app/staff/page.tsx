'use client';

import { useState, useEffect } from 'react';
import { createClient } from '../../lib/supabase/client';

interface StaffMember {
  user_id: string;
  role: string;
  full_name: string;
  phone: string | null;
}

interface ProfileOption {
  user_id: string;
  full_name: string | null;
}

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [profiles, setProfiles] = useState<ProfileOption[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRole, setSelectedRole] = useState('CASHIER');
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: member } = await supabase
        .from('tenant_members')
        .select('tenant_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (member) {
        // Fetch all members in this tenant
        const { data: members, error: membersErr } = await supabase
          .from('tenant_members')
          .select('user_id, role')
          .eq('tenant_id', member.tenant_id);

        if (membersErr) throw membersErr;

        // Fetch profiles of these members
        const userIds = members.map((m) => m.user_id);
        const { data: profilesData, error: profilesErr } = await supabase
          .from('profiles')
          .select('user_id, full_name, phone')
          .in('user_id', userIds);

        if (profilesErr) throw profilesErr;

        const profileMap = new Map(profilesData?.map((p) => [p.user_id, p]) || []);

        const mappedStaff = (members || []).map((m) => {
          const prof = profileMap.get(m.user_id);
          return {
            user_id: m.user_id,
            role: m.role,
            full_name: prof?.full_name || 'Staff Member',
            phone: prof?.phone || null,
          };
        });

        setStaff(mappedStaff);

        // Fetch other profiles that are NOT in this tenant (to invite them)
        const { data: allProfiles } = await supabase
          .from('profiles')
          .select('user_id, full_name')
          .not('user_id', 'in', `(${userIds.join(',')})`);

        setProfiles(allProfiles || []);
        const firstProfile = allProfiles?.[0];
        if (firstProfile) {
          setSelectedUserId(firstProfile.user_id);
        }
      }
    } catch (err: any) {
      console.error(err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: member } = await supabase
        .from('tenant_members')
        .select('tenant_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (member) {
        const { error: insertErr } = await supabase
          .from('tenant_members')
          .insert({
            tenant_id: member.tenant_id,
            user_id: selectedUserId,
            role: selectedRole,
          });

        if (insertErr) throw insertErr;

        setModalOpen(false);
        fetchData();
      }
    } catch (err: any) {
      alert(`Error adding staff member: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">Staff & Roles</h1>
          <p className="text-slate-400 mt-2">Manage cafe operators, cashiers, kitchen staff, and permissions.</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          disabled={profiles.length === 0}
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition shadow-lg shadow-sky-600/10 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Staff Member
        </button>
      </div>

      {/* Staff directory */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading staff directory...</div>
        ) : staff.length === 0 ? (
          <div className="p-12 text-center text-slate-400">No staff members linked.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Name / ID</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Assigned Role</th>
                  <th className="px-6 py-4">Privileges</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {staff.map((s) => (
                  <tr key={s.user_id} className="hover:bg-slate-850/50 transition">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-100">{s.full_name}</div>
                      <div className="text-xs font-mono text-slate-500 mt-0.5">{s.user_id}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{s.phone || 'No phone verified'}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                        {s.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400 max-w-xs">
                      {s.role === 'OWNER' && 'Full administrator control over all settings.'}
                      {s.role === 'MANAGER' && 'Can manage inventory, products, categories, and review sales.'}
                      {s.role === 'CASHIER' && 'Can operate checkout terminals, accept payments, and view shift totals.'}
                      {s.role === 'KITCHEN' && 'Access restricted to KDS operations only.'}
                      {s.role === 'STAFF' && 'Access to FOH tables and active tables ordering.'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Staff Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-850 flex items-center justify-between">
              <h3 className="font-bold text-slate-100 text-base">Add Staff Member</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 transition"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Select User Profile</label>
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
                >
                  {profiles.map((p) => (
                    <option key={p.user_id} value={p.user_id}>
                      {p.full_name} ({p.user_id.slice(0, 8)}...)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Assign Cafe Role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
                >
                  <option value="MANAGER">MANAGER (Outlet Operations)</option>
                  <option value="CASHIER">CASHIER (Checkout & POS)</option>
                  <option value="KITCHEN">KITCHEN (KDS screen)</option>
                  <option value="STAFF">STAFF (FOH Captain)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-855">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white transition"
                >
                  Invite Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
