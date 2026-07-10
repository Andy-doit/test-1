import { backendClient } from "@/lib/http/httpClient";
import { env } from "@/lib/env";
import type {
  Article,
  ArticleCategorySlug,
  ArticleDetail,
  PaginatedArticlesResponse,
  ApiArticleListItem,
  ApiArticleDetail,
} from "@/types/iReport";

const DEFAULT_COVER_FALLBACK = "/homePage/banner.jpg";

const buildMediaUrl = (path?: string | null) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  if (!env.mediaBaseUrl) return path;
  return `${env.mediaBaseUrl}${path}`;
};

const normalizeArticleBlocks = (value: ApiArticleDetail["contentBlocks"] | ApiArticleDetail["blocks"]) => {
  if (!value) return [];

  if (Array.isArray(value)) return value;

  return value.blocks ?? value.data ?? value.items ?? [];
};

const normalizeArticle = (article: ApiArticleListItem): Article => {
  const coverUrl = buildMediaUrl(article.coverUrl) ?? DEFAULT_COVER_FALLBACK;
  const primaryTag = article.tag ?? article.tags?.[0] ?? null;

  return {
    id: article.id,
    documentId: String(article.id), // Fallback since NestJS doesn't use documentId
    title: article.title,
    description: article.description ?? "",
    slug: article.slug,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
    publishedAt: article.publishedAt ?? article.createdAt,
    plans: [], // List item doesn't return plans in NestJS usually, or we can map it if needed
    category: article.category ? {
      id: article.category.id,
      documentId: String(article.category.id),
      name: article.category.name,
      slug: article.category.slug as ArticleCategorySlug,
      description: "",
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      publishedAt: article.createdAt,
    } : null,
    tag: primaryTag ? {
      id: primaryTag.id,
      documentId: String(primaryTag.id),
      name: primaryTag.name,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      publishedAt: article.createdAt,
    } : null,
    cover: article.coverUrl ? { url: article.coverUrl } : null,
    coverUrl,
  };
};

const buildArticleUrl = (category: ArticleCategorySlug, limit?: number) => {
  const url = `/articles`;
  const params = new URLSearchParams();
  if (category && category !== "all") {
    params.append("category", category);
  }
  if (limit) {
    params.append("limit", String(limit));
  }
  const qs = params.toString();
  return qs ? `${url}?${qs}` : url;
};

const buildArticleDetailUrl = (slug: string) => `/articles/${slug}`;

const normalizeArticleDetail = (article: ApiArticleDetail): ArticleDetail => {
  const normalized = normalizeArticle(article);

  return {
    ...normalized,
    plans: article.plans ? article.plans.map(p => ({
      id: p.planId,
      documentId: String(p.planId),
      name: p.plan.slug,
      level: p.plan.level,
      createdAt: normalized.createdAt,
      updatedAt: normalized.updatedAt,
      publishedAt: normalized.publishedAt,
    })) : [],
    blocks: normalizeArticleBlocks(article.contentBlocks ?? article.blocks),
    author: article.author ? {
      id: article.author.id,
      documentId: String(article.author.id),
      name: article.author.name ?? article.author.username ?? "Ẩn danh",
      createdAt: normalized.createdAt,
      updatedAt: normalized.updatedAt,
      publishedAt: normalized.publishedAt,
    } : null,
  };
};

export const getArticlesByCategory = async (
  category: ArticleCategorySlug,
  limit?: number,
): Promise<Article[]> => {
  const { data: payload } = await backendClient.get<PaginatedArticlesResponse>(
    buildArticleUrl(category, limit),
  );

  const articles = payload?.data ?? [];
  return articles.map(normalizeArticle);
};

export const getArticleBySlug = async (
  slug: string,
): Promise<ArticleDetail | null> => {
  try {
    const { data: article } = await backendClient.get<ApiArticleDetail>(
      buildArticleDetailUrl(slug),
    );

    if (!article) return null;
    return normalizeArticleDetail(article);
  } catch (error) {
    const err = error as { response?: { status?: number } };
    if (err.response?.status === 404) return null;
    throw error;
  }
};

