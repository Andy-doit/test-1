"use client";

import { useQuery, type QueryKey, type UseQueryOptions } from "@tanstack/react-query";
import {
  getPortfolioByPlan,
  type PortfolioItem,
  type PortfolioPlanName,
} from "@/lib/services/portfolioService";

type PortfolioQueryOptions = Omit<
  UseQueryOptions<PortfolioItem | null, Error, PortfolioItem | null, QueryKey>,
  "queryKey" | "queryFn"
>;

export const buildPortfolioQueryKey = (plan: PortfolioPlanName) =>
  ["portfolio", plan] as const;

export function usePortfolioQuery(plan: PortfolioPlanName, options?: PortfolioQueryOptions) {
  return useQuery({
    queryKey: buildPortfolioQueryKey(plan),
    queryFn: () => getPortfolioByPlan(plan),
    staleTime: 0, // Dữ liệu portfolio cần realtime hoặc invalidate sớm
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true, // Auto refetch khi user quay lại tab
    enabled: !!plan,
    ...options,
  }); 
}


