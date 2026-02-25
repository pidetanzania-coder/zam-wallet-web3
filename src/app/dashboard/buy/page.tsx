"use client";

import { CreditCard, ArrowUpRight, ArrowDownLeft, Bell } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function BuyPage() {
  const [notified, setNotified] = useState(false);

  const handleNotify = () => {
    setNotified(true);
    toast.success("You'll be notified when Buy & Sell is available!");
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Buy &amp; Sell</h1>

      <div className="card overflow-hidden">
        <div className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 -m-6 mb-0 p-8 text-white">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-16 translate-x-16" />
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
              <CreditCard className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold mb-2">Fiat On-Ramp &amp; Off-Ramp</h2>
            <p className="text-sm text-white/80 leading-relaxed">
              Buy crypto with your credit card, bank transfer, or Apple Pay. Sell crypto back to your local currency instantly.
            </p>
          </div>
        </div>

        <div className="pt-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 p-4 text-center">
              <ArrowDownLeft className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Buy Crypto</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Card, Bank, Apple Pay</p>
            </div>
            <div className="rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 p-4 text-center">
              <ArrowUpRight className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Sell Crypto</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">To bank account</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Supported Methods</h3>
            {[
              { name: "Credit / Debit Card", detail: "Visa, Mastercard" },
              { name: "Bank Transfer", detail: "SEPA, ACH, Wire" },
              { name: "Apple Pay / Google Pay", detail: "Instant" },
            ].map((method) => (
              <div key={method.name} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-[var(--surface-border)] last:border-0">
                <span className="text-sm text-slate-700 dark:text-slate-300">{method.name}</span>
                <span className="text-xs text-slate-400 dark:text-slate-500">{method.detail}</span>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 p-4 text-center">
            <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-1">Coming Soon</p>
            <p className="text-xs text-amber-600 dark:text-amber-400/70">
              We're integrating fiat payment providers. This feature will be available shortly.
            </p>
          </div>

          <button
            onClick={handleNotify}
            disabled={notified}
            className="btn-secondary w-full flex items-center justify-center gap-2"
          >
            <Bell className="w-4 h-4" />
            {notified ? "You'll be notified!" : "Notify Me When Available"}
          </button>
        </div>
      </div>
    </div>
  );
}
