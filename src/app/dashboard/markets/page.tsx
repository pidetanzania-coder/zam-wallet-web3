"use client";

import { useState, useEffect, useCallback } from "react";
import {
  TrendingUp,
  ExternalLink,
  RefreshCw,
  Clock,
  Users,
  Loader2,
  X,
  DollarSign,
  ArrowUpDown,
  Wallet,
  TrendingDown,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useDataContext } from "@/context/WalletProvider";
import {
  formatPrice,
  formatCurrency,
  formatPnL,
  calculateServiceFee,
  getMarketWithPrices,
} from "@/lib/polymarket";
import type { Market, MarketWithPrices, Position, TradePreview } from "@/types/prediction";

export default function MarketsPage() {
  const { address } = useDataContext();
  const [markets, setMarkets] = useState<MarketWithPrices[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPositions, setLoadingPositions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "24hr" | "volume">("all");
  const [activeTab, setActiveTab] = useState<"markets" | "positions">("markets");

  // Trade modal state
  const [tradeModal, setTradeModal] = useState<{
    isOpen: boolean;
    market: MarketWithPrices | null;
    outcome: "YES" | "NO";
  }>({
    isOpen: false,
    market: null,
    outcome: "YES",
  });
  const [tradeAmount, setTradeAmount] = useState<string>("");
  const [tradePreview, setTradePreview] = useState<TradePreview | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [tradeError, setTradeError] = useState<string | null>(null);
  const [tradeSuccess, setTradeSuccess] = useState<string | null>(null);

  const fetchMarkets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/polymarket/markets?limit=20");
      if (!response.ok) {
        throw new Error("Failed to fetch markets");
      }
      const data = await response.json();
      const marketsWithPrices = (data.markets || []).map(getMarketWithPrices);
      setMarkets(marketsWithPrices);
    } catch (err) {
      console.error("Error fetching markets:", err);
      setError("Failed to load markets. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPositions = useCallback(async () => {
    if (!address) return;
    setLoadingPositions(true);
    try {
      const response = await fetch(`/api/polymarket/positions?address=${address}`);
      if (!response.ok) {
        throw new Error("Failed to fetch positions");
      }
      const data = await response.json();
      setPositions(data.positions || []);
    } catch (err) {
      console.error("Error fetching positions:", err);
    } finally {
      setLoadingPositions(false);
    }
  }, [address]);

  useEffect(() => {
    fetchMarkets();
  }, []);

  useEffect(() => {
    if (address) {
      fetchPositions();
    }
  }, [address, fetchPositions]);

  // Filter and sort markets
  const filteredMarkets = [...markets].sort((a, b) => {
    if (filter === "24hr") return b.volume24hr - a.volume24hr;
    if (filter === "volume") return b.volume - a.volume;
    return b.liquidity - a.liquidity;
  });

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

  // Trade functions
  const openTradeModal = (market: MarketWithPrices, outcome: "YES" | "NO") => {
    setTradeModal({ isOpen: true, market, outcome });
    setTradeAmount("");
    setTradePreview(null);
    setTradeError(null);
    setTradeSuccess(null);
  };

  const closeTradeModal = () => {
    setTradeModal({ isOpen: false, market: null, outcome: "YES" });
    setTradeAmount("");
    setTradePreview(null);
    setTradeError(null);
    setTradeSuccess(null);
  };

  const generatePreview = async () => {
    if (!tradeModal.market || !tradeAmount || parseFloat(tradeAmount) <= 0) {
      setTradePreview(null);
      return;
    }

    const amount = parseFloat(tradeAmount);
    const price = tradeModal.outcome === "YES" 
      ? tradeModal.market.yesPrice 
      : tradeModal.market.noPrice;
    const fee = calculateServiceFee(amount);
    const netAmount = amount - fee;
    const potentialPayout = netAmount * (price > 0 ? 1 / price : 0);

    setTradePreview({
      amount,
      fee,
      totalAmount: amount,
      potentialPayout,
      outcome: tradeModal.outcome,
      marketQuestion: tradeModal.market.question,
    });
  };

  useEffect(() => {
    generatePreview();
  }, [tradeAmount, tradeModal.market, tradeModal.outcome]);

  const executeTrade = async () => {
    if (!tradeModal.market || !tradeAmount || !address) return;

    setIsExecuting(true);
    setTradeError(null);
    setTradeSuccess(null);

    try {
      const response = await fetch("/api/polymarket/trade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          marketId: tradeModal.market.id,
          outcome: tradeModal.outcome,
          amount: parseFloat(tradeAmount),
          walletAddress: address,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Trade failed");
      }

      setTradeSuccess(`Trade executed! TX: ${data.transactionHash?.slice(0, 10)}...`);
      
      // Refresh positions after successful trade
      setTimeout(() => {
        fetchPositions();
        closeTradeModal();
      }, 2000);
    } catch (err: any) {
      setTradeError(err.message || "Failed to execute trade");
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-indigo-600" />
            Prediction Trading
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Trade on real-world events powered by Polymarket
          </p>
        </div>
        <div className="flex items-center gap-2">
          {address && (
            <button
              onClick={fetchPositions}
              disabled={loadingPositions}
              className="flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              <Wallet className="w-4 h-4" />
              <span className="hidden sm:inline">My Positions</span>
            </button>
          )}
          <button
            onClick={fetchMarkets}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab("markets")}
          className={`px-4 py-3 font-medium border-b-2 transition-colors ${
            activeTab === "markets"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
          }`}
        >
          <TrendingUp className="w-4 h-4 inline-block mr-2" />
          Markets
        </button>
        <button
          onClick={() => setActiveTab("positions")}
          className={`px-4 py-3 font-medium border-b-2 transition-colors ${
            activeTab === "positions"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
          }`}
        >
          <Wallet className="w-4 h-4 inline-block mr-2" />
          My Positions
          {positions.length > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-indigo-100 dark:bg-indigo-500/30 text-indigo-600 dark:text-indigo-400">
              {positions.length}
            </span>
          )}
        </button>
      </div>

      {/* Markets Tab */}
      {activeTab === "markets" && (
        <>
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
                            <span>{formatCurrency(market.volume)} volume</span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                            <Clock className="w-4 h-4" />
                            <span>Ends {formatDate(market.endDate || "")}</span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                            <Users className="w-4 h-4" />
                            <span>{market.traderCount} traders</span>
                          </div>
                        </div>
                      </div>

                      {/* Prices & Trade Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 lg:w-80">
                        <div className="flex-1 grid grid-cols-2 gap-2">
                          <button
                            onClick={() => openTradeModal(market, "YES")}
                            disabled={market.yesPrice <= 0}
                            className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-center hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                          >
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Yes</p>
                            <p className="font-bold text-lg text-emerald-600 dark:text-emerald-400">
                              {formatPrice(market.yesPrice)}
                            </p>
                          </button>
                          <button
                            onClick={() => openTradeModal(market, "NO")}
                            disabled={market.noPrice <= 0}
                            className="p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-center hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors disabled:opacity-50"
                          >
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">No</p>
                            <p className="font-bold text-lg text-rose-600 dark:text-rose-400">
                              {formatPrice(market.noPrice)}
                            </p>
                          </button>
                        </div>
                        
                        {/* External Link */}
                        <a
                          href={market.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center px-3 py-3 bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-white/15 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}

      {/* Positions Tab */}
      {activeTab === "positions" && (
        <>
          {!address ? (
            <div className="card text-center py-12">
              <Wallet className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 mb-4">Connect your wallet to view positions</p>
            </div>
          ) : loadingPositions ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
              <span className="ml-3 text-slate-500">Loading positions...</span>
            </div>
          ) : positions.length === 0 ? (
            <div className="card text-center py-12">
              <Wallet className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No positions yet. Start trading to see your positions here!</p>
            </div>
          ) : (
            <>
              {/* Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="card">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total PnL</p>
                  <p className={`text-2xl font-bold ${
                    positions.reduce((sum, p) => sum + p.pnl, 0) >= 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                  }`}>
                    {formatCurrency(positions.reduce((sum, p) => sum + p.pnl, 0))}
                  </p>
                </div>
                <div className="card">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Active Positions</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {positions.length}
                  </p>
                </div>
                <div className="card">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Win Rate</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {Math.round(
                      (positions.filter((p) => p.pnl > 0).length / positions.length) * 100
                    )}%
                  </p>
                </div>
              </div>

              {/* Positions Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Market</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Outcome</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Amount</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Avg Price</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Current</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600 dark:text-slate-300">PnL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {positions.map((position) => (
                      <tr
                        key={position.id}
                        className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-white/5"
                      >
                        <td className="py-3 px-4">
                          <p className="text-sm font-medium text-slate-900 dark:text-white line-clamp-1">
                            {position.marketQuestion}
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${
                              position.outcome === "YES"
                                ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                                : "bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400"
                            }`}
                          >
                            {position.outcome}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right text-sm text-slate-600 dark:text-slate-300">
                          ${position.amount.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-right text-sm text-slate-600 dark:text-slate-300">
                          {formatPrice(position.avgPrice)}
                        </td>
                        <td className="py-3 px-4 text-right text-sm text-slate-600 dark:text-slate-300">
                          {formatPrice(position.currentPrice)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span
                            className={`text-sm font-medium ${
                              position.pnl >= 0
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-rose-600 dark:text-rose-400"
                            }`}
                          >
                            {formatPnL(position.pnl).text}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}

      {/* Trade Modal */}
      {tradeModal.isOpen && tradeModal.market && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl w-full max-w-md shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Trade {tradeModal.outcome}
              </h2>
              <button
                onClick={closeTradeModal}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 space-y-4">
              {/* Market Question */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5">
                <p className="text-sm text-slate-500 dark:text-slate-400">Market</p>
                <p className="font-medium text-slate-900 dark:text-white line-clamp-2">
                  {tradeModal.market.question}
                </p>
              </div>

              {/* Outcome Selector */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setTradeModal({ ...tradeModal, outcome: "YES" })}
                  className={`p-3 rounded-xl text-center transition-colors ${
                    tradeModal.outcome === "YES"
                      ? "bg-emerald-100 dark:bg-emerald-500/30 border-2 border-emerald-500"
                      : "bg-slate-50 dark:bg-white/5 border-2 border-transparent hover:bg-slate-100 dark:hover:bg-white/10"
                  }`}
                >
                  <p className="text-sm text-slate-500 dark:text-slate-400">Yes</p>
                  <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                    {formatPrice(tradeModal.market.yesPrice)}
                  </p>
                </button>
                <button
                  onClick={() => setTradeModal({ ...tradeModal, outcome: "NO" })}
                  className={`p-3 rounded-xl text-center transition-colors ${
                    tradeModal.outcome === "NO"
                      ? "bg-rose-100 dark:bg-rose-500/30 border-2 border-rose-500"
                      : "bg-slate-50 dark:bg-white/5 border-2 border-transparent hover:bg-slate-100 dark:hover:bg-white/10"
                  }`}
                >
                  <p className="text-sm text-slate-500 dark:text-slate-400">No</p>
                  <p className="text-xl font-bold text-rose-600 dark:text-rose-400">
                    {formatPrice(tradeModal.market.noPrice)}
                  </p>
                </button>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Amount (USDC)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="number"
                    value={tradeAmount}
                    onChange={(e) => setTradeAmount(e.target.value)}
                    placeholder="0.00"
                    min="1"
                    max="10000"
                    step="0.01"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-white/5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">Min: $1 | Max: $10,000</p>
              </div>

              {/* Trade Preview */}
              {tradePreview && parseFloat(tradeAmount) > 0 && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Amount</span>
                    <span className="text-slate-900 dark:text-white font-medium">
                      ${tradePreview.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Service Fee (1%)</span>
                    <span className="text-rose-600 dark:text-rose-400 font-medium">
                      -${tradePreview.fee.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-3 flex justify-between">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Potential Payout</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      ${tradePreview.potentialPayout.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {tradeError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400">
                  <AlertCircle className="w-5 h-5" />
                  <p className="text-sm">{tradeError}</p>
                </div>
              )}

              {/* Success Message */}
              {tradeSuccess && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="w-5 h-5" />
                  <p className="text-sm">{tradeSuccess}</p>
                </div>
              )}

              {/* Connect Wallet Prompt */}
              {!address && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <AlertCircle className="w-5 h-5" />
                  <p className="text-sm">Please connect your wallet to trade</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={executeTrade}
                disabled={!address || !tradeAmount || parseFloat(tradeAmount) <= 0 || isExecuting}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                {isExecuting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Executing...
                  </>
                ) : (
                  <>
                    <ArrowUpDown className="w-5 h-5" />
                    {address ? "Place Trade" : "Connect Wallet to Trade"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-sm text-slate-500 dark:text-slate-400">
        <p>Powered by Polymarket • Markets update in real-time • 1% service fee</p>
      </div>
    </div>
  );
}
