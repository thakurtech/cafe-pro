import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '../lib/supabase/server';
import './globals.css';

export const metadata: Metadata = {
  title: 'Restaurant OS — Platform Admin',
  description: 'Internal operations console',
};

// Next.js layouts can be server components
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  
  // Get active session
  const { data: { user } } = await supabase.auth.getUser();

  // If this is a login path, just render children without sidebar
  // (the middleware redirects authenticated users away from /login, and non-authenticated users to /login)
  // But we still need a check here just in case.
  
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased">
        <LayoutContent user={user}>{children}</LayoutContent>
      </body>
    </html>
  );
}

// Separate component to check platform admin authorization and render the layout
async function LayoutContent({ user, children }: { user: any; children: React.ReactNode }) {
  if (!user) {
    return <>{children}</>;
  }

  // Check if they are a PLATFORM_ADMIN in the database
  const supabase = await createClient();
  const { data: member } = await supabase
    .from('tenant_members')
    .select('role')
    .eq('user_id', user.id)
    .eq('role', 'PLATFORM_ADMIN')
    .maybeSingle();

  const isPlatformAdmin = !!member;

  // Sign out helper function for the server component
  const handleSignOut = async () => {
    'use server';
    const supabaseClient = await createClient();
    await supabaseClient.auth.signOut();
    redirect('/login');
  };

  if (!isPlatformAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
        <div className="max-w-md w-full bg-slate-900 border border-rose-950 rounded-2xl p-8 text-center shadow-xl">
          <div className="w-16 h-16 bg-rose-950/50 border border-rose-800 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-400">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-100">Access Denied</h2>
          <p className="text-slate-400 mt-3 text-sm">
            Your account ({user.email}) does not have the required <strong>PLATFORM_ADMIN</strong> privileges to access this console.
          </p>
          <form action={handleSignOut} className="mt-8">
            <button
              type="submit"
              className="px-6 py-2.5 bg-rose-700 hover:bg-rose-600 rounded-lg text-sm font-semibold transition"
            >
              Sign Out & Try Another Account
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Sidebar navigation paths
  const navItems = [
    { name: 'Dashboard', path: '/', icon: 'chart-pie' },
    { name: 'Cafes (Tenants)', path: '/cafes', icon: 'storefront' },
    { name: 'Outlets', path: '/outlets', icon: 'location' },
    { name: 'Subscriptions', path: '/subscriptions', icon: 'credit-card' },
    { name: 'Users & Roles', path: '/users', icon: 'users' },
    { name: 'Integration Health', path: '/integrations', icon: 'adjustments' },
    { name: 'System Health', path: '/system', icon: 'heart' },
    { name: 'Support', path: '/support', icon: 'support' },
    { name: 'Audit Logs', path: '/audit', icon: 'document-text' },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-lg text-white shadow-lg shadow-indigo-600/30">
              R
            </div>
            <div>
              <span className="font-bold text-slate-100 tracking-tight block">Restaurant OS</span>
              <span className="text-xs text-indigo-400 font-semibold tracking-wider uppercase">Platform Admin</span>
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

        {/* User profile section */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-sm font-semibold border border-slate-700">
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <div className="truncate">
              <span className="text-xs font-semibold text-slate-400 block">Logged in as</span>
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

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-x-hidden min-h-screen bg-slate-950">
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-900/10">
          <h2 className="font-bold text-lg text-slate-200 tracking-tight">Console Workspace</h2>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Sandbox
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

// Simple custom SVG icon renderer for the navigation sidebar
function NavIcon({ type }: { type: string }) {
  if (type === 'chart-pie') {
    return (
      <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.003 9.003 0 1020.945 13H11V3.055z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
      </svg>
    );
  }
  if (type === 'storefront') {
    return (
      <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    );
  }
  if (type === 'location') {
    return (
      <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    );
  }
  if (type === 'credit-card') {
    return (
      <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    );
  }
  if (type === 'users') {
    return (
      <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    );
  }
  if (type === 'adjustments') {
    return (
      <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    );
  }
  if (type === 'heart') {
    return (
      <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    );
  }
  if (type === 'support') {
    return (
      <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    );
  }
  return (
    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}
