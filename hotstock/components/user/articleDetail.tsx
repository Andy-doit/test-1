"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Calendar, User } from "lucide-react";
import { EmptyState } from "@/components/common/emptyState";
import { ArticleAccessOverlay } from "@/components/common/articleAccessOverlay";
const QuillRenderer = dynamic(() => import('./quillRenderer').then(mod => mod.QuillRenderer), {
  ssr: false,
  loading: () => <div className="p-4 bg-muted/20 min-h-[150px] animate-pulse rounded-md" />
});
import { ArticleCarousel } from "./articleCarousel";
import { useArticlesQuery } from "@/hooks/useArticlesQuery";
import { useAuthServer } from "@/hooks/useAuthServer";
import { canUserAccessArticle } from "@/lib/utils/planAccess";
import type { ArticleDetail, ArticleBlock, EditorTextBlock, SharedQuoteBlock, SharedRichTextBlock } from "@/types/iReport";
import { getArticleCategoryDisplayName } from "@/types/iReport";

interface ArticleDetailProps {
  article: ArticleDetail | null;
  isLoading?: boolean;
  error?: Error | null;
  categorySlug?: string;
}

const formatDate = (value?: string) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const isEditorTextBlock = (block: ArticleBlock): block is EditorTextBlock => {
  return "type" in block && block.type === "text";
};

const isRichTextBlock = (block: ArticleBlock): block is SharedRichTextBlock => {
  return "__component" in block && block.__component === "shared.rich-text";
};

const isQuoteBlock = (block: ArticleBlock): block is SharedQuoteBlock => {
  return "__component" in block && block.__component === "shared.quote";
};

const renderBlock = (block: ArticleBlock, index: number) => {
  if (isEditorTextBlock(block)) {
    if (!block.content?.trim()) return null;

    return (
      <div key={index} className="relative overflow-visible">
        <QuillRenderer content={block.content} className="article-content" />
      </div>
    );
  }

  if (isRichTextBlock(block)) {
    if (!block.body?.trim()) return null;

    return (
      <div key={index} className="relative overflow-visible">
        <QuillRenderer content={block.body} className="article-content" />
      </div>
    );
  }

  if (isQuoteBlock(block)) {
    if (!block.title && !block.body) return null;

    return (
      <blockquote
        key={index}
        className="relative border-l-4 border-[#6B21A8] dark:border-[#A78BFA] pl-8 py-6 my-8 bg-gradient-to-r from-[#6B21A8]/5 via-[#6B21A8]/3 to-transparent dark:from-[#A78BFA]/10 dark:via-[#A78BFA]/5 dark:to-transparent rounded-r-xl shadow-sm"
      >
        {block.title && (
          <h3 className="text-xl font-bold text-[#6B21A8] dark:text-[#A78BFA] mb-3">
            {block.title}
          </h3>
        )}
        {block.body && (
          <p className="text-lg text-gray-700 dark:text-gray-300 italic leading-relaxed">
            {block.body}
          </p>
        )}
      </blockquote>
    );
  }

  if ("__component" in block && block.__component === "shared.media") {
    return (
      <div key={index} className="my-10">
        <div className="w-full h-80 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 rounded-2xl flex items-center justify-center shadow-lg border border-gray-200/50 dark:border-gray-700/50">
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Media Content
          </p>
        </div>
      </div>
    );
  }

  if ("__component" in block && block.__component === "shared.slider") {
    return (
      <div key={index} className="my-10">
        <div className="w-full h-80 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 rounded-2xl flex items-center justify-center shadow-lg border border-gray-200/50 dark:border-gray-700/50">
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Slider Content
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export function ArticleDetail({
  article,
  isLoading = false,
  error = null,
  categorySlug,
}: ArticleDetailProps) {
  const { user, isAuthenticated } = useAuthServer();
  const articleCategory = useMemo(() => article?.category?.slug, [article?.category?.slug]);
  const backHref = useMemo(() => {
    const slug = articleCategory ?? categorySlug;
    if (!slug) return "/news";
    return `/news/${slug}`;
  }, [articleCategory, categorySlug]);
  const plans = useMemo(() => {
    return [...(article?.plans ?? [])].sort((a, b) => a.level - b.level);
  }, [article?.plans]);
  const hasAccess = useMemo(() => {
    if (!article) return true;
    return canUserAccessArticle(user?.plan ?? null, article.plans);
  }, [user?.plan, article]);
  const categoryDisplayName = useMemo(() => {
    return getArticleCategoryDisplayName(
      articleCategory,
      article?.category?.name ?? categorySlug ?? "Tin tá»©c",
    );
  }, [articleCategory, article?.category?.name, categorySlug]);
  const {
    data: relatedArticles = [],
    isLoading: isLoadingRelated,
  } = useArticlesQuery(
    (articleCategory as "economic" | "business" | "report-analysis" | "daily-market" | "chien-luoc") || "economic",
    {
      enabled: !!article && !!articleCategory,
    },
  );
  const filteredRelatedArticles = useMemo(() => {
    if (!article) return [];
    return relatedArticles.filter((item) => item.slug !== article.slug);
  }, [relatedArticles, article]);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <EmptyState
          title="Đang tải bài viết"
          description="Vui lòng chờ trong giây lát..."
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <EmptyState
          title="Không thể tải bài viết"
          description="Có lỗi xảy ra khi tải nội dung. Vui lòng thử lại sau."
        />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <EmptyState
          title="Không tìm thấy bài viết"
          description="Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa."
        />
      </div>
    );
  }
  return (
    <>
      {/* Overlay che bài viết nếu không có quyền */}
      {!hasAccess && (
        <ArticleAccessOverlay
          userPlan={user?.plan ?? null}
          articlePlans={article.plans}
          isAuthenticated={isAuthenticated}
          articleTitle={article.title}
        />
      )}

      <article className="relative min-h-screen py-8 md:py-20">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#6B21A8]/5 dark:bg-[#A78BFA]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#6B21A8]/5 dark:bg-[#A78BFA]/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 overflow-visible">
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center text-xl  gap-2 text-sm">
            <li>
              <Link
                href="/"
                className="text-gray-600 dark:text-gray-400 hover:text-[#6B21A8] dark:hover:text-[#A78BFA] transition-colors"
              >
                Trang chủ
              </Link>
            </li>
            <li className="text-gray-400 dark:text-gray-600">/</li>
            {categoryDisplayName && (
              <>
                <li>
                  <Link
                    href={backHref}
                    className="text-gray-600 dark:text-gray-400 hover:text-[#6B21A8] dark:hover:text-[#A78BFA] transition-colors"
                  >
                    {categoryDisplayName}
                  </Link>
                </li>
                <li className="text-gray-400 dark:text-gray-600">/</li>
              </>
            )}
            <li className="text-[#6B21A8] dark:text-[#A78BFA] font-medium truncate max-w-xs md:max-w-md lg:max-w-lg">
              {article.title}
            </li>
          </ol>
        </nav>

        <header className="mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {article.tag?.name && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-[#6B21A8]/10 to-[#6B21A8]/5 dark:from-[#A78BFA]/20 dark:to-[#A78BFA]/10 text-[#6B21A8] dark:text-[#A78BFA] border border-[#6B21A8]/20 dark:border-[#A78BFA]/30 shadow-sm">
                {article.tag.name}
              </span>
            )}
            {categoryDisplayName && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-white/80 dark:bg-white/5 text-foreground border border-white/30 dark:border-white/10 backdrop-blur-sm">
                {categoryDisplayName}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(article.publishedAt)}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white leading-[1.1] mb-6 tracking-tight">
            {article.title}
          </h1>

          {article.description && (
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8 font-light">
              {article.description}
            </p>
          )}

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 border-b border-gray-200/60 dark:border-gray-800/60">
            {article.author && (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6B21A8]/20 to-[#A78BFA]/20 dark:from-[#A78BFA]/30 dark:to-[#6B21A8]/30 flex items-center justify-center ring-2 ring-[#6B21A8]/20 dark:ring-[#A78BFA]/30">
                  <User className="w-6 h-6 text-[#6B21A8] dark:text-[#A78BFA]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {article.author.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Tác giả
                  </p>
                </div>
              </div>
            )}

            {plans.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {plans.map((plan) => (
                  <span
                    key={plan.id}
                    className="inline-flex items-center rounded-full border border-[#6B21A8]/30 dark:border-[#A78BFA]/40 px-3 py-1.5 text-xs font-semibold text-[#6B21A8] dark:text-[#A78BFA] bg-[#6B21A8]/5 dark:bg-[#A78BFA]/10 backdrop-blur-sm"
                  >
                    {plan.name}
                  </span>
                ))}
              </div>
            )}
          </div>


        </header>

        <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-a:text-[#6B21A8] dark:prose-a:text-[#A78BFA] prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 dark:prose-strong:text-white prose-code:text-[#6B21A8] dark:prose-code:text-[#A78BFA] prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950 prose-pre:border prose-pre:border-gray-800 overflow-visible">
          {article.blocks.length > 0 ? (
            <div className="space-y-8 overflow-visible">
              {article.blocks.map((block, index) => renderBlock(block, index))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Nội dung đang được cập nhật...
              </p>
            </div>
          )}
        </div>

        <div className="my-16 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />

        {!isLoadingRelated && filteredRelatedArticles.length > 0 && (
          <section className="mt-20 mb-12">
            <div className="mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                Bài viết liên quan
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Khám phá thêm các bài viết cùng chủ đề
              </p>
            </div>
            <div className="relative">
              <ArticleCarousel articles={filteredRelatedArticles} />
            </div>
          </section>
        )}

    
      </div>
    </article>
    </>
  );
}

