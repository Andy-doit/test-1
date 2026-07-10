import { unstable_cache } from "next/cache";
import { revalidateTag, revalidatePath } from "next/cache";

/**
 * Cache utilities sử dụng Next.js 16 caching APIs
 * Tối ưu performance với proper cache strategy
 */

/**
 * Tạo cached function với tags để có thể revalidate sau
 */
export function createCachedFunction<
  TArgs extends unknown[],
  TReturn,
  T extends (...args: TArgs) => Promise<TReturn>
>(
  fn: T,
  keyParts: string[],
  options?: {
    tags?: string[];
    revalidate?: number;
  }
): T {
  return unstable_cache(
    fn,
    keyParts,
    {
      tags: options?.tags,
      revalidate: options?.revalidate,
    }
  ) as T;
}

/**
 * Revalidate cache bằng tag
 * Sử dụng để invalidate cache khi có thay đổi
 */
export function invalidateCacheByTag(tag: string) {
  revalidateTag(tag, "page");
}

/**
 * Revalidate cache bằng path
 * Sử dụng để invalidate cache cho specific route
 */
export function invalidateCacheByPath(path: string) {
  revalidatePath(path, "page");
}

/**
 * Revalidate multiple tags cùng lúc
 */
export function invalidateMultipleTags(tags: string[]) {
  tags.forEach((tag) => revalidateTag(tag, "page"));
}

/**
 * Cache tags constants
 * Sử dụng để tag cache và revalidate có chọn lọc
 */
export const CACHE_TAGS = {
  USER: "user",
  USER_PROFILE: "user-profile",
  ARTICLES: "articles",
  ARTICLE: "article",
  ARTICLE_CATEGORY: "article-category",
} as const;

/**
 * Cache revalidation times (in seconds)
 */
export const CACHE_REVALIDATE = {
  SHORT: 60, // 1 phút
  MEDIUM: 300, // 5 phút
  LONG: 3600, // 1 giờ
  DAY: 86400, // 1 ngày
} as const;

