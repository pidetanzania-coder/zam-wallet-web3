"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ArrowUpDown,
  ArrowDownLeft,
  Repeat,
  CreditCard,
  History,
  Settings,
  HelpCircle,
  Wallet,
  TrendingUp,
  TrendingDown,
  Users,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/send", label: "Send", icon: ArrowUpDown },
  { href: "/dashboard/receive", label: "Receive", icon: ArrowDownLeft },
  { href: "/dashboard/swap", label: "Swap", icon: Repeat },
  { href: "/dashboard/earn", label: "Earn", icon: TrendingUp },

  { href: "/dashboard/buy", label: "Buy & Sell", icon: CreditCard, badge: "Soon" },
  { href: "/dashboard/history", label: "History", icon: History },
];

const bottomItems = [
  { href: "/dashboard/referral", label: "Referral", icon: Users, badge: "New" },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "#", label: "Help", icon: HelpCircle },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-[#161630] border-r border-slate-200 dark:border-[#2a2a4a]">
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="flex-1">{item.label}</span>
              {"badge" in item && item.badge && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-semibold">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 space-y-1 border-t border-slate-200 dark:border-[var(--surface-border)]">
        {bottomItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all duration-200"
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </Link>
        ))}

        <div className="mt-4 px-4 py-3 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20">
          <div className="flex items-center gap-2">
            <img src="/zamd-logo.png" alt="Zam Wallet" className="w-5 h-5 rounded-full" />
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Zam Wallet</span>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Secure Web3 Wallet</p>
        </div>
      </div>
    </aside>
  );
}
