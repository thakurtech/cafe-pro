import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '../lib/supabase/server';
import './globals.css';

export const metadata: Metadata = {
  title: 'Restaurant OS — Cafe Admin',
  description: 'Merchant Dashboard & POS Control Panel',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased">
        <LayoutContent user={user}>{children}</LayoutContent>
      </body>
    </html>
  );
}

async function LayoutContent({ user, children }: { user: any; children: React.ReactNode }) {
  if (!user) {
    return <>{children}</>;
  }

  const supabase = await createClient();
  
  // Fetch tenant member profile and associated tenant details
  const { data: member } = await supabase
    .from('tenant_members')
    .select('role, tenant_id')
    .eq('user_id', user.id)
    .maybeSingle();

  let tenant = null;
  if (member) {
    const { data: tenantData } = await supabase
      .from('tenants')
      .select('*')
      .eq('id', member.tenant_id)
      .maybeSingle();
    tenant = tenantData;
  }

  const handleSignOut = async () => {
    'use server';
    const supabaseClient = await createClient();
    await supabaseClient.auth.signOut();
    redirect('/login');
  };

  if (!member || !tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-xl">
          <div className="w-16 h-16 bg-amber-950/50 border border-amber-800 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-400">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-100">No Cafe Associated</h2>
          <p className="text-slate-400 mt-3 text-sm">
            Your account ({user.email}) is registered, but it has not been associated with a Cafe Tenant. Please contact your platform administrator.
          </p>
          <form action={handleSignOut} className="mt-8">
            <button
              type="submit"
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-semibold border border-slate-750 transition"
            >
              Sign Out & Try Again
            </button>
          </form>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: 'Home Summary', path: '/', icon: 'home' },
    { name: 'Menu Catalog', path: '/menu', icon: 'menu' },
    { name: 'Staff Management', path: '/staff', icon: 'staff' },
    { name: 'Customers & Loyalty', path: '/customers', icon: 'loyalty' },
    { name: 'Integrations', path: '/integrations', icon: 'integrations' },
    { name: 'System Settings', path: '/settings', icon: 'settings' },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center font-bold text-lg text-white shadow-lg shadow-sky-600/30">
              C
            </div>
            <div>
              <span className="font-bold text-slate-100 tracking-tight block truncate max-w-[150px]" title={tenant.name}>
                {tenant.name}
              </span>
              <span className="text-xs text-sky-400 font-semibold uppercase tracking-wider">
                {member.role}
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.path}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-100 hover:bg-slate-850 transition"
            >
              <NavIcon type={item.icon} />
              {item.name}
            </a>
          ))}
        </nav>

        {/* User profile footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-sm font-semibold border border-slate-700">
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <div className="truncate">
              <span className="text-xs font-semibold text-slate-400 block">Active User</span>
              <span className="text-xs text-slate-200 truncate block font-medium" title={user.email}>
                {user.email}
              </span>
            </div>
          </div>
          <form action={handleSignOut}>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-750 active:bg-slate-850 border border-slate-700 text-xs font-semibold text-slate-300 rounded-lg transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col overflow-x-hidden min-h-screen bg-slate-950">
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-900/10">
          <h2 className="font-bold text-lg text-slate-200 tracking-tight">Merchant Workspace</h2>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-500/10 text-sky-400 border border-sky-500/20">
              {tenant.plan_code.toUpperCase()} PLAN
            </span>
          </div>
        </header>
        <div className="flex-1 p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavIcon({ type }: { type: string }) {
  if (type === 'home') {
    return (
      <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    );
  }
  if (type === 'menu') {
    return (
      <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    );
  }
  if (type === 'staff') {
    return (
      <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    );
  }
  if (type === 'loyalty') {
    return (
      <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    );
  }
  if (type === 'integrations') {
    return (
      <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
      </svg>
    );
  }
  return (
    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
