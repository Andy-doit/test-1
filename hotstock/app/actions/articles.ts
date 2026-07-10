"use server";

import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/utils/cache";
import { handleServerAction, type ActionResult } from "@/lib/utils/serverAction";
import type { Article, ArticleCategorySlug, ArticleDetail } from "@/types/iReport";
import { getArticlesByCategory, getArticleBySlug } from "@/lib/services/articlesService";

/**
 * Server Action để lấy articles theo category với caching
 * Sử dụng Next.js 16 unstable_cache với tags để có thể revalidate
 */
export async function getArticlesByCategoryAction(
  category: ArticleCategorySlug,
  limit?: number,
): Promise<ActionResult<Article[]>> {
  return handleServerAction(async () => {
    return unstable_cache(
      async () => {
        return await getArticlesByCategory(category, limit);
      },
      [`articles-${category}-${limit ?? 'all'}`],
      {
        tags: [
          CACHE_TAGS.ARTICLES,
          CACHE_TAGS.ARTICLE_CATEGORY,
          `category-${category}`,
        ],
        revalidate: 60, // Cache 60 giây
      }
    )();
  });
}

/**
 * Server Action để lấy article detail với caching
 */
export async function getArticleBySlugAction(
  slug: string,
): Promise<ActionResult<ArticleDetail | null>> {
  return handleServerAction(async () => {
    return unstable_cache(
      async () => {
        return await getArticleBySlug(slug);
      },
      [`article-${slug}`],
      {
        tags: [CACHE_TAGS.ARTICLES, CACHE_TAGS.ARTICLE, `article-${slug}`],
        revalidate: 300, 
      }
    )();
  });
}

