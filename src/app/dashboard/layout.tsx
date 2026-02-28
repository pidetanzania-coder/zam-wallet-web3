"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useSignerStatus, useAccount } from "@account-kit/react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { DataProvider } from "@/context/WalletProvider";
import { Spinner } from "@/components/ui/Spinner";
import { useTransactionNotifications } from "@/hooks/useTransactionNotifications";
import { isLocalSignerLogin, getLocalAccountAddress } from "@/components/auth/PrivateKeyLogin";
import {
  LayoutDashboard,
  ArrowUpDown,
  ArrowDownLeft,
  Repeat,
  TrendingUp,
  Settings,
} from "lucide-react";
import Link from "next/link";

const navItems = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/dashboard/send", label: "Send", icon: ArrowUpDown },
  { href: "/dashboard/receive", label: "Receive", icon: ArrowDownLeft },
  { href: "/dashboard/swap", label: "Swap", icon: Repeat },
  { href: "/dashboard/earn", label: "Earn", icon: TrendingUp },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isConnected, isInitializing } = useSignerStatus();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Use state for local signer to enable reactive updates
  const [isLocalSigner, setIsLocalSigner] = useState(false);
  const [localAddress, setLocalAddress] = useState<string | null>(null);

  // Check for local signer on mount and when needed
  useEffect(() => {
    const checkLocalSigner = () => {
      if (typeof window === "undefined") return { isLocal: false, address: null };
      // Check window first
      if ((window as any).__localSigner) {
        return { isLocal: true, address: (window as any).__localAccountAddress };
      }
      // Check sessionStorage
      const sessionAddress = sessionStorage.getItem("localSignerAddress");
      if (sessionAddress) {
        return { isLocal: true, address: sessionAddress };
      }
      return { isLocal: false, address: null };
    };

    const signerInfo = checkLocalSigner();
    setIsLocalSigner(signerInfo.isLocal);
    setLocalAddress(signerInfo.address);
  }, []);

  // Also check periodically for local signer changes
  useEffect(() => {
    const interval = setInterval(() => {
      const windowAddress = (window as any).__localAccountAddress;
      const sessionAddress = sessionStorage.getItem("localSignerAddress");
      const windowSigner = (window as any).__localSigner;
      
      if (windowSigner || sessionAddress) {
        setIsLocalSigner(true);
        setLocalAddress(windowAddress || sessionAddress);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const isLocalLogin = searchParams.get("signer") === "local" || isLocalSigner;

  // Enable transaction notifications - must be called before any early returns
  useTransactionNotifications();

  useEffect(() => {
    // Don't redirect during initialization - let the session restore first
    if (isInitializing) return;
    
    // Add a longer delay to allow Alchemy session to fully restore
    const timer = setTimeout(() => {
      // Only redirect if user is definitely NOT logged in (not just loading)
      if (!isConnected && !isLocalLogin) {
        // Double-check after a short delay
        const checkAgain = setTimeout(() => {
          if (!isConnected && !isLocalLogin) {
            router.push("/");
          }
        }, 1000);
        return () => clearTimeout(checkAgain);
      }
      // If user is connected, stay on current page
    }, 2500); // 2.5 seconds delay for session restoration
    
    return () => clearTimeout(timer);
  }, [isInitializing, isConnected, isLocalLogin, router]);

  // Show loading state while initializing
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // If not initialized and not logged in, show loading (session might be restoring)
  if (!isConnected && !isLocalLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <DataProvider>
      <div className="min-h-screen bg-[var(--background)]">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-4 lg:p-6 max-w-5xl pb-24 lg:pb-6">{children}</main>
        </div>
        
        {/* Mobile Bottom Navigation */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#0a0a14] border-t border-slate-200 dark:border-white/10 px-2 py-2 z-30">
          <div className="flex items-center justify-around">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                    isActive
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </DataProvider>
  );
}
