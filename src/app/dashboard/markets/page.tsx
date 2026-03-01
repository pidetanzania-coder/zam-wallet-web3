"use client";

import { useState, useEffect } from "react";
import { TrendingUp, ExternalLink, RefreshCw, Clock, Users, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";

interface Market {
  id: string;
  question: string;
  description: string;
  slug: string;
  image: string;
  volume: number;
  volume24hr: number;
  liquidity: number;
  endDate: string;
  outcomes: string[];
  prices: string[];
  traderCount: number;
  url: string;
}

export default function MarketsPage() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "24hr" | "volume">("all");

  const fetchMarkets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/markets?limit=20");
      if (!response.ok) {
        throw new Error("Failed to fetch markets");
      }
      const data = await response.json();
      setMarkets(data.markets || []);
    } catch (err) {
      console.error("Error fetching markets:", err);
      setError("Failed to load markets. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarkets();
  }, []);

  // Filter and sort markets
  const filteredMarkets = [...markets].sort((a, b) => {
    if (filter === "24hr") return b.volume24hr - a.volume24hr;
    if (filter === "volume") return b.volume - a.volume;
    return b.liquidity - a.liquidity;
  });

  const formatVolume = (vol: number) => {
    if (vol >= 1000000) return `$${(vol / 1000000).toFixed(1)}M`;
    if (vol >= 1000) return `$${(vol / 1000).toFixed(1)}K`;
    return `$${vol.toFixed(0)}`;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getOutcomeColor = (index: number) => {
    return index === 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-indigo-600" />
            Prediction Markets
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Trade on real-world events powered by Polymarket
          </p>
        </div>
        <button
          onClick={fetchMarkets}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        {(["all", "24hr", "volume"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/15"
            }`}
          >
            {f === "all" ? "All Markets" : f === "24hr" ? "24h Volume" : "Total Volume"}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <span className="ml-3 text-slate-500">Loading markets...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="card bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={fetchMarkets}
            className="mt-2 text-sm text-red-500 hover:text-red-600 font-medium"
          >
            Try again
          </button>
        </div>
      )}

      {/* Markets List */}
      {!loading && !error && (
        <div className="space-y-4">
          {filteredMarkets.length === 0 ? (
            <div className="card text-center py-12">
              <TrendingUp className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No markets available right now</p>
            </div>
          ) : (
            filteredMarkets.map((market) => (
              <div
                key={market.id}
                className="card hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Market Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-white text-lg line-clamp-2">
                      {market.question}
                    </h3>
                    {market.description && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {market.description}
                      </p>
                    )}
                    
                    {/* Stats */}
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                        <TrendingUp className="w-4 h-4" />
                        <span>{formatVolume(market.volume)} volume</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                        <Clock className="w-4 h-4" />
                        <span>Ends {formatDate(market.endDate)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                        <Users className="w-4 h-4" />
                        <span>{market.traderCount} traders</span>
                      </div>
                    </div>
                  </div>

                  {/* Prices */}
                  <div className="flex flex-col sm:flex-row gap-3 lg:w-64">
                    {market.prices && market.prices.length > 0 ? (
                      market.prices.map((price, idx) => (
                        <div
                          key={idx}
                          className="flex-1 p-3 rounded-xl bg-slate-50 dark:bg-white/5 text-center min-w-[80px]"
                        >
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                            {market.outcomes?.[idx] || (idx === 0 ? "Yes" : "No")}
                          </p>
                          <p className={`font-bold text-lg ${getOutcomeColor(idx)}`}>
                            {parseFloat(price) > 0 
                              ? `${(parseFloat(price) * 100).toFixed(0)}%`
                              : "N/A"
                            }
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="flex-1 p-3 rounded-xl bg-slate-50 dark:bg-white/5 text-center">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Yes</p>
                        <p className="font-bold text-lg text-emerald-600 dark:text-emerald-400">-</p>
                      </div>
                    )}
                    
                    {/* Trade Button */}
                    <a
                      href={market.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
                    >
                      Trade
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-sm text-slate-500 dark:text-slate-400">
        <p>Powered by Polymarket • Markets update in real-time</p>
      </div>
    </div>
  );
}
