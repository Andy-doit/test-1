"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";

export const getPlanName = (plan: { name?: string; slug?: string } | null): string => {
  if (!plan) return "free";
  return plan.slug || plan.name?.toLowerCase() || "free";
};

export const getPlanColor = (planName: string): string => {
  switch (planName.toLowerCase()) {
    case "bronze":
      return "bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30";
    case "titan":
      return "bg-slate-200/80 dark:bg-slate-400/30 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-500";
    case "gold":
      return "bg-yellow-400/80 dark:bg-yellow-500/40 text-yellow-900 dark:text-yellow-200 border-yellow-500 dark:border-yellow-400";
    case "premium":
      return "bg-purple-400/80 dark:bg-purple-500/40 text-purple-900 dark:text-purple-100 border-purple-500 dark:border-purple-400";
    default:
      return "bg-green-500/80 dark:bg-green-600/40 text-green-900 dark:text-green-100 border-green-500 dark:border-green-400";
  }
};

interface PlanBadgeProps {
  plan: { name?: string; slug?: string } | null;
}

export function PlanBadge({ plan }: PlanBadgeProps) {
  // Memoize planName và colorClass để tránh tính toán lại
  const planName = useMemo(() => getPlanName(plan), [plan]);
  const colorClass = useMemo(() => getPlanColor(planName), [planName]);

  return (
    <Badge
      variant="outline"
      className={`h-6 px-2 text-xs font-semibold uppercase border ${colorClass}`}
    >
      {planName}
    </Badge>
  );
}

