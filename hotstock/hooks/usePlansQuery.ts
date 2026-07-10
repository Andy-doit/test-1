"use client";

import { useQuery, type QueryKey, type UseQueryOptions } from "@tanstack/react-query";
import { getPlans, type PlanApiResponse } from "@/lib/services/plansService";

type PlansQueryOptions = Omit<
  UseQueryOptions<PlanApiResponse[], Error, PlanApiResponse[], QueryKey>,
  "queryKey" | "queryFn"
>;

export const buildPlansQueryKey = () => ["plans"] as const;

export function usePlansQuery(options?: PlansQueryOptions) {
  return useQuery({
    queryKey: buildPlansQueryKey(),
    queryFn: () => getPlans(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
}

