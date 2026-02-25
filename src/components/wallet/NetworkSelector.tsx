"use client";

import { useState } from "react";
import { useChain } from "@account-kit/react";
import { getAllChainMetas, getChainMeta } from "@/config/chains";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function NetworkSelector() {
  const { chain, setChain } = useChain();
  const [open, setOpen] = useState(false);
  const currentMeta = getChainMeta(chain.id);
  const allChains = getAllChainMetas();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 transition-colors"
      >
        <img
          src={currentMeta.logo}
          alt={chain.name}
          className="w-5 h-5"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300 hidden sm:block">
          {chain.name}
        </span>
        <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-white dark:bg-[var(--surface-card)] border border-slate-200 dark:border-[var(--surface-border)] shadow-xl z-50 overflow-hidden">
            <div className="p-2 max-h-80 overflow-y-auto">
              <p className="px-3 py-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Select Network
              </p>
              {allChains.map((meta) => {
                const isActive = meta.chain.id === chain.id;
                return (
                  <button
                    key={meta.chain.id}
                    onClick={() => {
                      setChain({ chain: meta.chain });
                      setOpen(false);
                    }}
                    className={cn(
                      "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-colors",
                      isActive
                        ? "bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
                    )}
                  >
                    <img
                      src={meta.logo}
                      alt={meta.chain.name}
                      className="w-6 h-6"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <span className="text-sm font-medium flex-1 text-left">
                      {meta.chain.name}
                    </span>
                    {isActive && <Check className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
