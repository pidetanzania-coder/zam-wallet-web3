"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { PortfolioCard } from "@/components/wallet/PortfolioCard";
import { PortfolioChart } from "@/components/wallet/PortfolioChart";
import { TokenList } from "@/components/wallet/TokenList";
import { TransactionHistory } from "@/components/wallet/TransactionHistory";
import { SendModal } from "@/components/wallet/SendModal";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import {
  DashboardSkeleton,
  PortfolioCardSkeleton,
  TokenListSkeleton,
  TransactionHistorySkeleton,
} from "@/components/ui/Skeleton";

export default function DashboardPage() {
  const [showSend, setShowSend] = useState(false);
  const router = useRouter();

  return (
    <div className="space-y-6">
      <ErrorBoundary>
        <PortfolioCard
          onSend={() => setShowSend(true)}
          onReceive={() => router.push("/dashboard/receive")}
        />
      </ErrorBoundary>

      {/* Portfolio Chart */}
      <ErrorBoundary>
        <Suspense fallback={<div className="card h-72 animate-pulse bg-slate-100 dark:bg-[var(--surface-card)] rounded-2xl" />}>
          <PortfolioChart />
        </Suspense>
      </ErrorBoundary>

      <div className="grid lg:grid-cols-2 gap-6">
        <ErrorBoundary>
          <Suspense fallback={<TokenListSkeleton />}>
            <TokenList />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense fallback={<TransactionHistorySkeleton />}>
            <TransactionHistory />
          </Suspense>
        </ErrorBoundary>
      </div>

      <SendModal isOpen={showSend} onClose={() => setShowSend(false)} />
    </div>
  );
}
