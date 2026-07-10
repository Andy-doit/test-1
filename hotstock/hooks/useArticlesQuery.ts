"use client";

import {
  useQuery,
  type QueryKey,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { getArticlesByCategory } from "@/lib/services/articlesService";
import type { Article, ArticleCategorySlug } from "@/types/iReport";

type ArticlesQueryOptions = Omit<
  UseQueryOptions<Article[], Error, Article[], QueryKey>,
  "queryKey" | "queryFn"
>;

export const buildArticlesQueryKey = (category: ArticleCategorySlug, limit?: number) =>
  ["articles", category, limit] as const;

export function useArticlesQuery(
  category: ArticleCategorySlug,
  options?: ArticlesQueryOptions & { limit?: number },
) {
  const { limit, ...queryOptions } = options || {};
  
  return useQuery({
    queryKey: buildArticlesQueryKey(category, limit),
    queryFn: () => getArticlesByCategory(category, limit),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    ...queryOptions,
  });
}

