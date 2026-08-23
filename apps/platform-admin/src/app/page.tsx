import { createClient } from '../lib/supabase/server';

export default async function PlatformAdminDashboard() {
  const supabase = await createClient();

  // Query counts dynamically from the database
  const { count: tenantsCount } = await supabase
    .from('tenants')
    .select('*', { count: 'exact', head: true });

  const { count: outletsCount } = await supabase
    .from('outlets')
    .select('*', { count: 'exact', head: true });

  const { count: activeSubs } = await supabase
    .from('tenants')
    .select('*', { count: 'exact', head: true })
    .eq('subscription_status', 'active');

  const { count: trialingSubs } = await supabase
    .from('tenants')
    .select('*', { count: 'exact', head: true })
    .eq('subscription_status', 'trialing');

  // Estimate MRR (Starter: 499, Growth: 999, Pro: 1999 INR)
  const { data: tenantPlans } = await supabase
    .from('tenants')
    .select('plan_code')
    .eq('subscription_status', 'active');

  const mrrEstimate = (tenantPlans || []).reduce((acc, curr) => {
    if (curr.plan_code === 'growth') return acc + 999;
    if (curr.plan_code === 'pro') return acc + 1999;
    return acc + 499; // Default starter
  }, 0);

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">System Dashboard</h1>
        <p className="text-slate-400 mt-2">Overall health, tenant metrics, and subscription performance.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Tenants */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-slate-400">Total Tenants</span>
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-100">{tenantsCount ?? 0}</div>
          <div className="text-xs text-indigo-400 font-semibold mt-2">Registered brands</div>
        </div>

        {/* Total Outlets */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-slate-400">Active Outlets</span>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-100">{outletsCount ?? 0}</div>
          <div className="text-xs text-emerald-400 font-semibold mt-2">Physical locations</div>
        </div>

        {/* Active Subscriptions */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-slate-400">Active Subscriptions</span>
            <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-100">{activeSubs ?? 0}</div>
          <div className="text-xs text-slate-400 font-semibold mt-2">
            <span className="text-sky-400">{trialingSubs ?? 0}</span> in trialing phase
          </div>
        </div>

        {/* Estimated MRR */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-slate-400">Monthly Recurring Revenue</span>
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16v1m-4-6h8" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-100">₹{mrrEstimate}</div>
          <div className="text-xs text-amber-400 font-semibold mt-2">Estimated current MRR</div>
        </div>
      </div>

      {/* System Metrics and Summary Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Core System health graph block */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-200">Database & Event Traffic</h2>
              <p className="text-xs text-slate-400 mt-1">Queries execution and events emitted (past 24 hrs)</p>
            </div>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
              Healthy
            </span>
          </div>

          {/* Simple custom SVG mock line graph */}
          <div className="h-64 flex items-end justify-between relative mt-6 px-2 border-b border-slate-800">
            <div className="absolute left-0 right-0 top-0 h-full flex flex-col justify-between pointer-events-none">
              <div className="border-t border-slate-800/50 w-full h-0"></div>
              <div className="border-t border-slate-800/50 w-full h-0"></div>
              <div className="border-t border-slate-800/50 w-full h-0"></div>
              <div className="border-t border-slate-800/50 w-full h-0"></div>
            </div>

            {/* Custom pure Tailwind visual bar chart representing server workload */}
            <div className="w-12 flex flex-col items-center gap-2 group">
              <div className="w-full bg-indigo-600/30 group-hover:bg-indigo-600/50 transition rounded-t h-28 relative">
                <div className="absolute bottom-0 w-full bg-indigo-500 h-16 rounded-t shadow-lg shadow-indigo-500/10"></div>
              </div>
              <span className="text-[10px] font-semibold text-slate-500">08 AM</span>
            </div>

            <div className="w-12 flex flex-col items-center gap-2 group">
              <div className="w-full bg-indigo-600/30 group-hover:bg-indigo-600/50 transition rounded-t h-40 relative">
                <div className="absolute bottom-0 w-full bg-indigo-500 h-28 rounded-t shadow-lg shadow-indigo-500/10"></div>
              </div>
              <span className="text-[10px] font-semibold text-slate-500">12 PM</span>
            </div>

            <div className="w-12 flex flex-col items-center gap-2 group">
              <div className="w-full bg-indigo-600/30 group-hover:bg-indigo-600/50 transition rounded-t h-52 relative">
                <div className="absolute bottom-0 w-full bg-indigo-500 h-44 rounded-t shadow-lg shadow-indigo-500/10"></div>
              </div>
              <span className="text-[10px] font-semibold text-slate-500">04 PM</span>
            </div>

            <div className="w-12 flex flex-col items-center gap-2 group">
              <div className="w-full bg-indigo-600/30 group-hover:bg-indigo-600/50 transition rounded-t h-44 relative">
                <div className="absolute bottom-0 w-full bg-indigo-500 h-32 rounded-t shadow-lg shadow-indigo-500/10"></div>
              </div>
              <span className="text-[10px] font-semibold text-slate-500">08 PM</span>
            </div>

            <div className="w-12 flex flex-col items-center gap-2 group">
              <div className="w-full bg-indigo-600/30 group-hover:bg-indigo-600/50 transition rounded-t h-32 relative">
                <div className="absolute bottom-0 w-full bg-indigo-500 h-12 rounded-t shadow-lg shadow-indigo-500/10"></div>
              </div>
              <span className="text-[10px] font-semibold text-slate-500">12 AM</span>
            </div>
          </div>
        </div>

        {/* Integration Status Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-200 mb-6">Provider Connections</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-850">
                <span className="text-sm font-medium text-slate-300">Razorpay API</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-400">
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-850">
                <span className="text-sm font-medium text-slate-300">Twilio SMS</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-400">
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-850">
                <span className="text-sm font-medium text-slate-300">WhatsApp Gateway</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-400">
                  Online
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <a
              href="/integrations"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center justify-center gap-1"
            >
              Configure Gateway Integrations &rarr;
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
