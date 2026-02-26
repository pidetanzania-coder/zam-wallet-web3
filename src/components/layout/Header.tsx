"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount, useUser, useLogout, useChain } from "@account-kit/react";
import { NetworkSelector } from "@/components/wallet/NetworkSelector";
import { useTheme } from "@/context/ThemeProvider";
import { shortenAddress, copyToClipboard } from "@/lib/utils";
import { getLocalAccountAddress, isLocalSignerLogin } from "@/components/auth/PrivateKeyLogin";
import {
  Copy,
  Check,
  LogOut,
  ChevronDown,
  Wallet,
  ExternalLink,
  Sun,
  Moon,
  Menu,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

export function Header() {
  const { address: alchemyAddress } = useAccount({ type: "LightAccount" });
  const user = useUser();
  const { logout } = useLogout();
  const { chain } = useChain();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Check for local signer address
  const localAddress = getLocalAccountAddress();
  const isLocal = isLocalSignerLogin();
  const address = alchemyAddress || localAddress || undefined;

  const explorerUrl = chain?.blockExplorers?.default?.url || "https://etherscan.io";

  const handleCopy = async () => {
    if (!address) return;
    await copyToClipboard(address);
    setCopied(true);
    toast.success("Address copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDisconnect = () => {
    if (isLocal) {
      // Clear local signer sessionStorage
      sessionStorage.removeItem("localSignerAddress");
      sessionStorage.removeItem("localSignerType");
      sessionStorage.removeItem("localSignerCredential");
      // Clear window globals
      if (typeof window !== "undefined") {
        delete (window as any).__localSigner;
        delete (window as any).__localAccountAddress;
      }
      toast.success("Wallet disconnected");
      router.push("/");
    } else {
      logout();
    }
    setShowMenu(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-[#0a0a14]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl overflow-hidden">
            <img src="/zamd-logo.png" alt="Zam Wallet" className="w-9 h-9 object-cover" />
          </div>
          <span className="text-lg font-bold text-slate-900 dark:text-white hidden sm:block">
            Zam Wallet
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 transition-colors"
            title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          >
            {theme === "light" ? (
              <Moon className="w-4 h-4 text-slate-600" />
            ) : (
              <Sun className="w-4 h-4 text-yellow-400" />
            )}
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 transition-colors"
          >
            {showMobileMenu ? (
              <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            ) : (
              <Menu className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            )}
          </button>

          {/* Mobile Menu Content */}
          {showMobileMenu && (
            <div className="lg:hidden absolute top-16 left-0 right-0 bg-white dark:bg-[#0a0a14] border-b border-slate-200 dark:border-white/10 p-4 z-50">
              <div className="space-y-2">
                <NetworkSelector />
                {address && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 transition-colors"
                  >
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-sm font-mono text-slate-600 dark:text-slate-300">
                      {shortenAddress(address)}
                    </span>
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500 ml-auto" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-slate-400 ml-auto" />
                    )}
                  </button>
                )}
                <button
                  onClick={handleDisconnect}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-red-500 dark:text-red-400 w-full"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Disconnect</span>
                </button>
              </div>
            </div>
          )}

          <div className="hidden lg:flex items-center gap-2">
            <NetworkSelector />

            {address && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-sm font-mono text-slate-600 dark:text-slate-300">
                  {shortenAddress(address)}
                </span>
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>
            )}

            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600" />
                <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-64 rounded-xl bg-white dark:bg-[var(--surface-card)] border border-slate-200 dark:border-[var(--surface-border)] shadow-xl z-50 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 dark:border-[var(--surface-border)]">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {user?.email || "Smart Wallet"}
                      </p>
                      <p className="text-xs text-slate-400 font-mono mt-1 truncate">
                        {address}
                      </p>
                    </div>
                    <div className="p-2">
                      <a
                        href={`${explorerUrl}/address/${address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-slate-600 dark:text-slate-300"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span className="text-sm">View on Explorer</span>
                      </a>
                      <button
                        onClick={handleDisconnect}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-red-500 dark:text-red-400 w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Disconnect</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
