"use client";

import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Spinner({ size = "md", className }: SpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-10 h-10",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-slate-200 dark:border-white/20 border-t-indigo-500",
        sizeClasses[size],
        className
      )}
    />
  );
}
