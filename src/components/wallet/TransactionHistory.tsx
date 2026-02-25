"use client";

import { useDataContext } from "@/context/WalletProvider";
import { useChain } from "@account-kit/react";
import { useTransactions } from "@/hooks/useTransactions";
import { shortenAddress } from "@/lib/utils";
import { Spinner } from "@/components/ui/Spinner";
import {
  ArrowUpRight,
  ArrowDownLeft,
  ExternalLink,
  History,
  RefreshCw,
} from "lucide-react";
import type { Transaction } from "@/types";
import Link from "next/link";

// Format timestamp using device time (local timezone)
function formatTransactionTime(tx: { blockNum?: string; timestamp?: string }): string {
  // Try to use timestamp if available
  if (!tx.timestamp || tx.timestamp === "0") {
    // No timestamp available
    return "";
  }
  
  let ts = parseInt(tx.timestamp);
  
  // If timestamp is 0 or invalid
  if (isNaN(ts) || ts === 0) {
    return "";
  }
  
  // If timestamp looks like it's in seconds (before year 2030 = 1893456000)
  if (ts < 1893456000) {
    ts = ts * 1000;
  }
  
  // Sanity check: if still too old (before 2020), return empty
  if (ts < 1577836800000) { // Jan 1, 2020
    return "";
  }
  
  const now = Date.now();
  const diff = now - ts;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  // Use device's local time formatting for older transactions
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function TransactionHistory() {
  const { transactions } = useDataContext();
  const { chain } = useChain();
  const { loading, refetch } = useTransactions();

  const explorerUrl = chain?.blockExplorers?.default?.url || "https://etherscan.io";

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Activity</h2>
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

      <div className="space-y-1">
        {transactions.slice(0, 5).map((tx, i) => {
          const isOut = tx.direction === "out";
          
          return (
            <a
              key={`${tx.hash}-${tx.direction}-${i}`}
              href={`${explorerUrl}/tx/${tx.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isOut ? "bg-red-50 dark:bg-red-500/15" : "bg-emerald-50 dark:bg-emerald-500/15"
                }`}
              >
                {isOut ? (
                  <ArrowUpRight className="w-5 h-5 text-red-500 dark:text-red-400" />
                ) : (
                  <ArrowDownLeft className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {isOut ? "Sent" : "Received"} {tx.asset}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                  {isOut
                    ? `To: ${shortenAddress(tx.to || "")}`
                    : `From: ${shortenAddress(tx.from)}`}
                </p>
              </div>
              <div className="text-right flex flex-col items-end gap-1">
                <span
                  className={`text-sm font-medium ${
                    isOut ? "text-red-500 dark:text-red-400" : "text-emerald-500 dark:text-emerald-400"
                  }`}
                >
                  {isOut ? "-" : "+"}{parseFloat(tx.value).toFixed(4)} {tx.asset}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {formatTransactionTime({ blockNum: tx.blockNum, timestamp: tx.timestamp })}
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </a>
          );
        })}

        {loading && (
          <div className="flex items-center justify-center py-8">
            <Spinner />
          </div>
        )}

        {!loading && transactions.length === 0 && (
          <div className="text-center py-8">
            <History className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-400 dark:text-slate-500">No transactions yet</p>
          </div>
        )}

        {transactions.length > 5 && (
          <Link
            href="/dashboard/history"
            className="flex items-center justify-center gap-2 w-full py-3 mt-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-colors"
          >
            View More
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
