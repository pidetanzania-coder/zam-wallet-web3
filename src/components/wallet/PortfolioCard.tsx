"use client";

import { useDataContext } from "@/context/WalletProvider";
import { formatBalance, formatUsd } from "@/lib/utils";
import { ArrowUpRight, ArrowDownLeft, RefreshCw, TrendingUp, TrendingDown } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";

interface PortfolioCardProps {
  onSend?: () => void;
  onReceive?: () => void;
}

export function PortfolioCard({ onSend, onReceive }: PortfolioCardProps) {
  const { nativeBalance, tokens, refreshBalance, isLoadingBalance } =
    useDataContext();

  const totalValue =
    (nativeBalance?.valueUsd || 0) +
    tokens.reduce((sum, t) => sum + (t.valueUsd || 0), 0);

  // Calculate weighted 24h change
  const calculate24hChange = () => {
    if (totalValue === 0) return 0;
    let weightedChange = 0;
    if (nativeBalance?.valueUsd && nativeBalance?.priceUsd) {
      const weight = nativeBalance.valueUsd / totalValue;
      weightedChange += weight * (nativeBalance.change24h || 0);
    }
    tokens.forEach((token) => {
      if (token.valueUsd && token.priceUsd) {
        const weight = token.valueUsd / totalValue;
        weightedChange += weight * (token.change24h || 0);
      }
    });
    return weightedChange;
  };

  const change24h = calculate24hChange();
  const isPositive = change24h >= 0;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 text-white">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-32 translate-x-32" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-24 -translate-x-24" />

      <div className="relative">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm text-white/70">Total Balance</p>
          <button
            onClick={refreshBalance}
            disabled={isLoadingBalance}
            className="p-1.5 rounded-lg hover:bg-white/15 transition-colors"
          >
            <RefreshCw
              className={`w-4 h-4 text-white/70 ${isLoadingBalance ? "animate-spin" : ""}`}
            />
          </button>
        </div>

        <div className="flex items-baseline gap-3 mb-1">
          {nativeBalance !== undefined ? (
            <h1 className="text-4xl font-bold text-white">
              {formatUsd(totalValue)}
            </h1>
          ) : (
            <Spinner size="md" />
          )}
        </div>

        <div className="flex items-center gap-3 mb-6">
          {change24h !== 0 && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              isPositive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
            }`}>
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{isPositive ? '+' : ''}{change24h.toFixed(2)}% (24h)</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
