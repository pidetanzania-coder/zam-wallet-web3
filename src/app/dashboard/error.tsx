"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  // Generate user-friendly error message
  const getErrorMessage = () => {
    if (error.message.includes("Failed to fetch") || error.message.includes("Network")) {
      return "Unable to connect. Please check your internet connection and try again.";
    }
    if (error.message.includes("balance") || error.message.includes("token")) {
      return "Unable to load your wallet data. Please try again.";
    }
    if (error.message.includes("transaction")) {
      return "Transaction failed. Please try again or check your balance.";
    }
    return "Something went wrong. Please try again.";
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-[var(--background)]">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-500 dark:text-red-400" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          Oops! Something went wrong
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md">
          {getErrorMessage()}
        </p>
        {error.digest && (
          <p className="text-xs text-slate-500 mb-6">Error ID: {error.digest}</p>
        )}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors"
          >
            <Home className="w-4 h-4" />
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
