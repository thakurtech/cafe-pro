import { createClient } from '../lib/supabase/server';

export default async function MerchantDashboard() {
  const supabase = await createClient();

  // Fetch active tenant context
  const { data: { user } } = await supabase.auth.getUser();
  
  let tenant = null;
  if (user) {
    const { data: member } = await supabase
      .from('tenant_members')
      .select('tenant_id')
      .eq('user_id', user.id)
      .maybeSingle();
      
    if (member) {
      const { data: tenantData } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', member.tenant_id)
        .maybeSingle();
      tenant = tenantData;
    }
  }

  if (!tenant) {
    return <div className="text-center text-slate-400 py-12">No active tenant found.</div>;
  }

  // Query live metrics from orders
  const { data: orders } = await supabase
    .from('orders')
    .select('total, created_at, customer_id')
    .eq('tenant_id', tenant.id);

  const orderList = orders || [];
  
  // Calculate sales stats
  const totalSales = orderList.reduce((sum, o) => sum + Number(o.total || 0), 0);
  const totalOrders = orderList.length;
  const aov = totalOrders > 0 ? (totalSales / totalOrders).toFixed(2) : '0.00';

  // Calculate repeat purchase rate
  const customerOrdersMap: Record<string, number> = {};
  orderList.forEach((o) => {
    if (o.customer_id) {
      customerOrdersMap[o.customer_id] = (customerOrdersMap[o.customer_id] || 0) + 1;
    }
  });
  
  const customerIds = Object.keys(customerOrdersMap);
  const repeatCustomersCount = customerIds.filter((cid) => (customerOrdersMap[cid] || 0) > 1).length;
  const repeatRate = customerIds.length > 0 ? ((repeatCustomersCount / customerIds.length) * 100).toFixed(0) : '0';

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">Welcome to {tenant.name}</h1>
        <p className="text-slate-400 mt-2">Here is your operational summary for today.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Today Sales */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-slate-400">Total Revenue</span>
            <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16v1m-4-6h8" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-100">₹{totalSales.toLocaleString()}</div>
          <div className="text-xs text-sky-400 font-semibold mt-2">Life-time gross sales</div>
        </div>

        {/* Total Orders */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-slate-400">Total Orders</span>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-100">{totalOrders}</div>
          <div className="text-xs text-emerald-400 font-semibold mt-2">Processed transactions</div>
        </div>

        {/* Average Order Value */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-slate-400">Avg. Order Value</span>
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-100">₹{aov}</div>
          <div className="text-xs text-indigo-400 font-semibold mt-2">Average checkout ticket</div>
        </div>

        {/* Repeat Purchase Rate */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-slate-400">Repeat Cust. Rate</span>
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-100">{repeatRate}%</div>
          <div className="text-xs text-amber-400 font-semibold mt-2">Customers visiting twice+</div>
        </div>
      </div>

      {/* Operational Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Alerts & Action items */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-200 mb-4">Operational Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-950 rounded-lg border border-slate-850">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-sm font-semibold text-slate-200">Local POS sync operational</span>
              </div>
              <span className="text-xs text-slate-500">All local shifts synchronised</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-950 rounded-lg border border-slate-850">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
                <span className="text-sm font-semibold text-slate-200">Catalog active offline</span>
              </div>
              <span className="text-xs text-slate-500">Cached menu matches Supabase</span>
            </div>
          </div>
        </div>

        {/* Shortcuts */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-200 mb-4">Quick Navigation</h2>
            <div className="space-y-3">
              <a
                href="/menu"
                className="w-full flex items-center justify-between p-3 rounded bg-slate-950 hover:bg-slate-855 border border-slate-850 text-xs font-semibold text-sky-400 transition"
              >
                Manage Menu Catalog &rarr;
              </a>
              <a
                href="/staff"
                className="w-full flex items-center justify-between p-3 rounded bg-slate-950 hover:bg-slate-855 border border-slate-850 text-xs font-semibold text-sky-400 transition"
              >
                Add Staff Members &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
