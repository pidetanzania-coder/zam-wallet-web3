"use client";

import { useEffect } from "react";
import { Home, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  // Generate user-friendly error message
  const getErrorMessage = () => {
    if (error.message.includes("Failed to fetch") || error.message.includes("Network")) {
      return "Unable to connect. Please check your internet connection and try again.";
    }
    if (error.message.includes("authentication") || error.message.includes("auth")) {
      return "Session expired. Please sign in again to continue.";
    }
    return "Something went wrong. Please try again.";
  };

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#050510] text-white">
        <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-slate-400 mb-6 max-w-md">
            {getErrorMessage()}
          </p>
          {error.digest && (
            <p className="text-xs text-slate-500 mb-6">Error ID: {error.digest}</p>
          )}
          <div className="flex items-center gap-3">
            <button
              onClick={() => reset()}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
