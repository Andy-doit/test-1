"use client";

import {
  useQuery,
  type QueryKey,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { getArticleBySlug } from "@/lib/services/articlesService";
import type { ArticleDetail } from "@/types/iReport";

type ArticleQueryOptions = Omit<
  UseQueryOptions<ArticleDetail | null, Error, ArticleDetail | null, QueryKey>,
  "queryKey" | "queryFn"
>;

export const buildArticleQueryKey = (slug: string) =>
  ["article", slug] as const;

export function useArticleQuery(
  slug: string,
  options?: ArticleQueryOptions,
) {
  return useQuery({
    queryKey: buildArticleQueryKey(slug),
    queryFn: () => getArticleBySlug(slug),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!slug,
    ...options,
  });
}

