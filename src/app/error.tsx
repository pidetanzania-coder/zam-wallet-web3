"use client";

import { useEffect } from "react";
import Image from "next/image";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0e17] p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">⚠️</span>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-3">
          Something went wrong!
        </h2>
        
        <p className="text-slate-400 mb-8">
          We encountered an error. Please try again or contact support if the problem persists.
        </p>
        
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors"
          >
            Try again
          </button>
          
          <a
            href="/"
            className="px-6 py-3 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white font-semibold rounded-xl transition-colors"
          >
            Go Home
          </a>
        </div>
        
        {error.digest && (
          <p className="text-xs text-slate-500 mt-6">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
