'use client';

import { useState, useEffect } from 'react';
import { createClient } from '../../lib/supabase/client';

interface UserRoleInfo {
  user_id: string;
  tenant_id: string;
  role: string;
  full_name: string | null;
  email?: string;
  tenant_name?: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserRoleInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState<UserRoleInfo | null>(null);
  const [newRole, setNewRole] = useState('');

  const supabase = createClient();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // 1. Fetch tenant_members
      const { data: members, error: membersErr } = await supabase
        .from('tenant_members')
        .select('*');

      if (membersErr) throw membersErr;

      // 2. Fetch profiles
      const { data: profiles, error: profilesErr } = await supabase
        .from('profiles')
        .select('user_id, full_name');

      if (profilesErr) throw profilesErr;

      // 3. Fetch tenants to map names
      const { data: tenants, error: tenantsErr } = await supabase
        .from('tenants')
        .select('id, name');

      if (tenantsErr) throw tenantsErr;

      // 4. Map them together
      const profileMap = new Map(profiles?.map((p) => [p.user_id, p.full_name]) || []);
      const tenantMap = new Map(tenants?.map((t) => [t.id, t.name]) || []);

      const mappedUsers: UserRoleInfo[] = (members || []).map((m: any) => ({
        user_id: m.user_id,
        tenant_id: m.tenant_id,
        role: m.role,
        full_name: profileMap.get(m.user_id) || 'Unknown Staff',
        tenant_name: tenantMap.get(m.tenant_id) || 'System',
      }));

      setUsers(mappedUsers);
    } catch (err: any) {
      console.error('Error fetching users:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const { error } = await supabase
        .from('tenant_members')
        .update({ role: newRole })
        .eq('user_id', editingUser.user_id)
        .eq('tenant_id', editingUser.tenant_id);

      if (error) throw error;

      setEditingUser(null);
      fetchUsers();
    } catch (err: any) {
      alert(`Error updating role: ${err.message}`);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      (u.full_name && u.full_name.toLowerCase().includes(search.toLowerCase())) ||
      u.role.toLowerCase().includes(search.toLowerCase()) ||
      (u.tenant_name && u.tenant_name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">Users & Roles</h1>
        <p className="text-slate-400 mt-2">Manage backend system user access controls and operations profiles.</p>
      </div>

      {/* Filter panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="relative w-full max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search full name, role, or brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>
      </div>

      {/* Users directory list */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading users directory...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-slate-400">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Full Name / Profile ID</th>
                  <th className="px-6 py-4">Tenant Scope</th>
                  <th className="px-6 py-4">Assigned Role</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filteredUsers.map((u) => (
                  <tr key={`${u.user_id}-${u.tenant_id}`} className="hover:bg-slate-850/50 transition">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-100">{u.full_name}</div>
                      <div className="text-xs font-mono text-slate-500 mt-0.5">{u.user_id}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{u.tenant_name}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setEditingUser(u);
                          setNewRole(u.role);
                        }}
                        className="px-3 py-1.5 rounded text-xs font-bold bg-indigo-950/20 hover:bg-indigo-950/40 text-indigo-400 border border-indigo-900/30 transition"
                      >
                        Edit Role
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Role Dialog */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-850 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-100 text-base">Adjust User Role</h3>
                <span className="text-xs text-slate-400 mt-1 block">
                  {editingUser.full_name} ({editingUser.tenant_name})
                </span>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="text-slate-400 hover:text-slate-200 transition"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpdateRole} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Select Role Type</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="PLATFORM_ADMIN">PLATFORM_ADMIN (Global Console)</option>
                  <option value="OWNER">OWNER (Cafe Merchant Owner)</option>
                  <option value="MANAGER">MANAGER (Outlet Manager)</option>
                  <option value="CASHIER">CASHIER (POS Operator)</option>
                  <option value="KITCHEN">KITCHEN (KDS Operator)</option>
                  <option value="STAFF">STAFF (FOH Captain)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-850">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-600/10"
                >
                  Apply Role Change
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
