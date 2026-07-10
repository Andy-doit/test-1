"use client";

import Link from "next/link";
import { FeaturedArticle } from "./featuredArticle";
import { ArticleCarousel } from "./articleCarousel";
import { EmptyState } from "@/components/common/emptyState";
import { useArticlesQuery } from "@/hooks/useArticlesQuery";
import {
  ARTICLE_CATEGORY_DISPLAY_NAMES,
  type ArticleCategorySlug,
} from "@/types/iReport";

interface NewsLayoutProps {
  title: string;
  category: ArticleCategorySlug;
  limit?: number;
}

export function NewsLayout({ title, category, limit = 8 }: NewsLayoutProps) {
  const {
    data: articles = [],
    isLoading,
    error,
  } = useArticlesQuery(category, {
    limit: limit || undefined,
  });

  const featured = articles[0];
  const remainingArticles = articles.slice(1);

  const displayTitle = ARTICLE_CATEGORY_DISPLAY_NAMES[category] ?? title;

  return (
    <section className="relative py-25 overflow-hidden">
      <div className="relative max-w-[1600px] mx-auto px-4 md:px-6 space-y-6 min-h-[100vh]">
        <nav className="text-sm">
          <ol className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <li>
              <Link
                href="/"
                className="hover:text-[#6B21A8] dark:hover:text-[#A78BFA] transition-colors"
              >
                Trang chủ
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-[#6B21A8] dark:text-[#A78BFA] font-medium">
              {displayTitle}
            </li>
          </ol>
        </nav>

        <div className="flex flex-col gap-3 md:gap-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.1] bg-gradient-to-tr from-[#5C278B] to-[#A084FB] bg-clip-text text-transparent">
            {displayTitle}
          </h1>
        </div>

        {isLoading && (
          <EmptyState
            title="Đang tải dữ liệu"
            description="Vui lòng chờ trong giây lát, chúng tôi đang lấy dữ liệu bài viết mới nhất."
          />
        )}

        {!isLoading && error && (
          <EmptyState
            title="Không thể tải dữ liệu"
            description="Có lỗi xảy ra khi tải nội dung. Vui lòng thử lại sau."
          />
        )}

        {!isLoading && !error && (
          <>
            {featured && <FeaturedArticle article={featured} fallbackCategorySlug={category} />}
            {remainingArticles.length > 0 && (
              <ArticleCarousel articles={remainingArticles} fallbackCategorySlug={category} />
            )}
            {!articles.length && (
              <EmptyState
                title="Chưa có bài viết"
                description="Nội dung sẽ được cập nhật ngay khi có báo cáo mới."
              />
            )}
          </>
        )}
      </div>
    </section>
  );
}

