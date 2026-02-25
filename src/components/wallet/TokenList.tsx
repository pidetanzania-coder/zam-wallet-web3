"use client";

import { useState, useMemo } from "react";
import { useDataContext } from "@/context/WalletProvider";
import { useChain } from "@account-kit/react";
import { useTokenBalances } from "@/hooks/useTokenBalances";
import { formatBalance, formatUsd } from "@/lib/utils";
import { getChainMeta } from "@/config/chains";
import { Spinner } from "@/components/ui/Spinner";
import { Coins, RefreshCw, Search, ChevronDown, ChevronUp, TrendingUp, ArrowUpDown } from "lucide-react";

export function TokenList() {
  const { tokens, nativeBalance } = useDataContext();
  const { chain } = useChain();
  const { loading, refetch } = useTokenBalances();
  const meta = getChainMeta(chain.id);

  // Search and sort state
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"value" | "balance" | "name">("value");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Filter and sort tokens
  const filteredAndSortedTokens = useMemo(() => {
    let result = [...tokens];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (token) =>
          token.symbol.toLowerCase().includes(query) ||
          token.name.toLowerCase().includes(query) ||
          token.contractAddress.toLowerCase().includes(query)
      );
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "value":
          comparison = (a.valueUsd || 0) - (b.valueUsd || 0);
          break;
        case "balance":
          comparison = parseFloat(a.balanceFormatted) - parseFloat(b.balanceFormatted);
          break;
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
      }
      return sortOrder === "desc" ? -comparison : comparison;
    });

    return result;
  }, [tokens, searchQuery, sortBy, sortOrder]);

  const handleSort = (field: "value" | "balance" | "name") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Tokens</h2>
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative flex-1 sm:w-40">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search tokens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-[var(--surface-elevated)] border border-slate-200 dark:border-[var(--surface-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                const options: Array<"value" | "balance" | "name"> = ["value", "balance", "name"];
                const currentIndex = options.indexOf(sortBy);
                const nextIndex = (currentIndex + 1) % options.length;
                handleSort(options[nextIndex]);
              }}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              title={`Sort by ${sortBy}`}
            >
              <ArrowUpDown className="w-4 h-4 text-slate-400" />
            </button>
          </div>
          <button
            onClick={refetch}
            disabled={loading}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          >
            <RefreshCw
              className={`w-4 h-4 text-slate-400 ${loading ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Sort indicator */}
      <div className="flex items-center gap-2 mb-2 text-xs text-slate-400">
        <span>Sorted by:</span>
        <span className="font-medium text-indigo-600 dark:text-indigo-400 capitalize">
          {sortBy === "value" ? "Value" : sortBy === "balance" ? "Balance" : "Name"}
        </span>
        {sortOrder === "desc" ? (
          <ChevronDown className="w-3 h-3" />
        ) : (
          <ChevronUp className="w-3 h-3" />
        )}
      </div>

      <div className="space-y-1">
        {nativeBalance && (
          <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-[var(--surface-elevated)] flex items-center justify-center overflow-hidden">
              <img
                src={meta.logo}
                alt={nativeBalance.symbol}
                className="w-6 h-6"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white">{nativeBalance.name}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">{nativeBalance.symbol}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {formatBalance(nativeBalance.balanceFormatted, 6)}
              </p>
              {nativeBalance.valueUsd !== null && (
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {formatUsd(nativeBalance.valueUsd)}
                </p>
              )}
            </div>
          </div>
        )}

        {filteredAndSortedTokens.map((token) => (
          <div
            key={token.contractAddress}
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-[var(--surface-elevated)] flex items-center justify-center overflow-hidden">
              {token.logo ? (
                <img src={token.logo} alt={token.symbol} className="w-10 h-10 rounded-full" />
              ) : (
                <Coins className="w-5 h-5 text-slate-400 dark:text-slate-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{token.name}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">{token.symbol}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {formatBalance(token.balanceFormatted, 6)}
              </p>
              {token.valueUsd !== null && (
                <div className="flex items-center justify-end gap-1">
                  <p className="text-xs text-slate-400 dark:text-slate-500">{formatUsd(token.valueUsd)}</p>
                  {token.change24h !== null && (
                    <span className={`text-xs ${token.change24h >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                      {token.change24h >= 0 ? "+" : ""}{token.change24h.toFixed(2)}%
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center justify-center py-8">
            <Spinner />
          </div>
        )}

        {!loading && tokens.length === 0 && nativeBalance && (
          <div className="text-center py-8">
            <Coins className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-400 dark:text-slate-500">No tokens found</p>
          </div>
        )}
      </div>
    </div>
  );
}
