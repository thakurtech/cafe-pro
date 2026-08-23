"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  ShoppingCart, 
  ClipboardList, 
  ChefHat, 
  Grid2X2, 
  MenuSquare, 
  Users, 
  Package, 
  Star, 
  Tag,
  Megaphone, 
  Gamepad2, 
  UserCircle, 
  LineChart, 
  CreditCard,
  Settings,
  Coffee,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "POS Terminal", href: "/pos", icon: ShoppingCart, external: false },
  { name: "Kitchen KDS", href: "/kitchen", icon: ChefHat, external: false },
  { name: "Orders & Refunds", href: "/dashboard/orders", icon: ClipboardList },
  { name: "Tables & QR", href: "/dashboard/tables", icon: Grid2X2 },
  { name: "Menu & Pricing", href: "/dashboard/menu", icon: MenuSquare },
  { name: "Customer CRM", href: "/dashboard/customers", icon: Users },
  { name: "Inventory", href: "/dashboard/inventory", icon: Package },
  { name: "Loyalty & Rewards", href: "/dashboard/loyalty", icon: Star },
  { name: "Coupons & Offers", href: "/dashboard/discounts", icon: Tag },
  { name: "Campaigns", href: "/dashboard/campaigns", icon: Megaphone },
  { name: "Gamification", href: "/dashboard/games", icon: Gamepad2 },
  { name: "Staff & Shifts", href: "/dashboard/staff", icon: UserCircle },
  { name: "Analytics", href: "/dashboard/analytics", icon: LineChart },
  { name: "Subscription", href: "/dashboard/subscriptions", icon: CreditCard },
  { name: "Settings & Brand", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col bg-[#0f172a] text-slate-300 shadow-2xl z-20 hidden md:flex shrink-0">
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight">CafeOS</span>
              <span className="text-[10px] block text-emerald-400 font-medium tracking-wide uppercase">Merchant Suite</span>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-3 px-2 custom-scrollbar space-y-6">
          <div>
            <div className="px-3 mb-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Daily Operations
            </div>
            <nav className="space-y-0.5">
              {NAV_ITEMS.slice(0, 7).map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150",
                      isActive 
                        ? "bg-indigo-600 text-white shadow-sm font-semibold" 
                        : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                    )}
                  >
                    <Icon className={cn("w-4 h-4 mr-2.5 shrink-0", isActive ? "text-white" : "text-slate-400")} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div>
            <div className="px-3 mb-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Growth & Marketing
            </div>
            <nav className="space-y-0.5">
              {NAV_ITEMS.slice(7, 12).map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150",
                      isActive 
                        ? "bg-indigo-600 text-white shadow-sm font-semibold" 
                        : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                    )}
                  >
                    <Icon className={cn("w-4 h-4 mr-2.5 shrink-0", isActive ? "text-white" : "text-slate-400")} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div>
            <div className="px-3 mb-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Management & Controls
            </div>
            <nav className="space-y-0.5">
              {NAV_ITEMS.slice(12).map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150",
                      isActive 
                        ? "bg-indigo-600 text-white shadow-sm font-semibold" 
                        : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                    )}
                  >
                    <Icon className={cn("w-4 h-4 mr-2.5 shrink-0", isActive ? "text-white" : "text-slate-400")} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
        
        <div className="p-3 border-t border-slate-800 shrink-0 bg-slate-900/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold shrink-0 text-xs">
                CN
              </div>
              <div className="ml-2.5 overflow-hidden">
                <p className="text-xs font-medium text-white truncate">Café Noir</p>
                <p className="text-[10px] text-emerald-400 truncate">● Active Trial (₹499/mo)</p>
              </div>
            </div>
            <Link 
              href="/shop/cafe-noir" 
              target="_blank" 
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
              title="Open Customer Storefront"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-10 bg-slate-50">
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
