"use client";

import React from "react";
import { clsx } from "clsx";

interface SkeletonProps {
  className?: string;
}

// Base skeleton component
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={clsx(
        "animate-pulse bg-slate-200 dark:bg-slate-700 rounded",
        className
      )}
    />
  );
}

// Card skeleton for portfolio
export function PortfolioCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-32 translate-x-32" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-24 -translate-x-24" />
      <div className="relative">
        <div className="flex items-center justify-between mb-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-6 rounded-lg" />
        </div>
        <Skeleton className="h-10 w-40 mb-1" />
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-12 flex-1 rounded-xl" />
          <Skeleton className="h-12 flex-1 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// Chart skeleton
export function ChartSkeleton() {
  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <Skeleton className="h-4 w-24 mb-1" />
          <Skeleton className="h-8 w-32" />
        </div>
        <Skeleton className="h-8 w-48 rounded-lg" />
      </div>
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  );
}

// Token list skeleton
export function TokenListSkeleton() {
  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <Skeleton className="h-6 w-20" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-40 rounded-lg" />
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>
      </div>
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
            <div className="text-right">
              <Skeleton className="h-4 w-20 mb-1" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Transaction history skeleton
export function TransactionHistorySkeleton() {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-3 w-32" />
            </div>
            <div className="text-right">
              <Skeleton className="h-4 w-20 mb-1" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Quick action skeleton
export function QuickActionsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {[...Array(2)].map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-[var(--surface-card)] border border-slate-200 dark:border-[var(--surface-border)]"
        >
          <Skeleton className="w-10 h-10 rounded-xl" />
          <div className="flex-1">
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="w-4 h-4" />
        </div>
      ))}
    </div>
  );
}

// Combined dashboard skeleton
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <PortfolioCardSkeleton />
      <ChartSkeleton />
      <QuickActionsSkeleton />
      <div className="grid lg:grid-cols-2 gap-6">
        <TokenListSkeleton />
        <TransactionHistorySkeleton />
      </div>
    </div>
  );
}
