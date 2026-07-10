"use client";

import React, { useMemo, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Newspaper, ChevronLeft, ChevronRight } from "lucide-react";
import { useArticlesQuery } from "@/hooks/useArticlesQuery";
import { useCategoriesQuery } from "@/hooks/useCategoriesQuery";
import { EmptyState } from "@/components/common/emptyState";
import type { Article, ArticleCategorySlug } from "@/types/iReport";
import { getArticleCategoryDisplayName } from "@/types/iReport";

const FALLBACK_IMAGE = "/homePage/banner.jpg";

const formatDate = (value?: string) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const buildArticleHref = (category: ArticleCategorySlug, slug: string) =>
  `/news/${category}/${slug}`;

const getImage = (article?: Article) => article?.coverUrl ?? FALLBACK_IMAGE;

export function NewsCarouselSection() {
  const [sortBy, setSortBy] = useState<string>("all");
  const carouselRef = useRef<HTMLDivElement>(null);
  const { data: categories = [], isLoading: categoriesLoading } = useCategoriesQuery();

  const displayCategories = useMemo(
    () => categories.filter((category) => category.isVisibleOnUI !== false).slice(0, 3),
    [categories],
  );

  const firstCategory = displayCategories[0]?.slug ?? "";
  const secondCategory = displayCategories[1]?.slug ?? "";
  const thirdCategory = displayCategories[2]?.slug ?? "";

  const {
    data: firstCategoryArticles = [],
    isLoading: firstCategoryLoading,
  } = useArticlesQuery(firstCategory, {
    limit: 10,
    enabled: Boolean(firstCategory),
  });

  const {
    data: secondCategoryArticles = [],
    isLoading: secondCategoryLoading,
  } = useArticlesQuery(secondCategory, {
    limit: 10,
    enabled: Boolean(secondCategory),
  });

  const {
    data: thirdCategoryArticles = [],
    isLoading: thirdCategoryLoading,
  } = useArticlesQuery(thirdCategory, {
    limit: 10,
    enabled: Boolean(thirdCategory),
  });

  const allArticles = useMemo(() => {
    const categoryArticleGroups: Array<{
      category?: { slug: ArticleCategorySlug; name: string };
      articles: Article[];
    }> = [
      { category: displayCategories[0], articles: firstCategoryArticles },
      { category: displayCategories[1], articles: secondCategoryArticles },
      { category: displayCategories[2], articles: thirdCategoryArticles },
    ];

    const combined: (Article & { categorySlug: ArticleCategorySlug })[] = categoryArticleGroups.flatMap(
      ({ category, articles }) =>
        category
          ? articles.map((article) => ({
              ...article,
              categorySlug: article.category?.slug ?? category.slug,
            }))
          : [],
    );

    combined.sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return dateB - dateA;
    });

    if (sortBy !== "all") {
      return combined.filter((article) => article.categorySlug === sortBy);
    }

    return combined.slice(0, 5);
  }, [
    displayCategories,
    firstCategoryArticles,
    secondCategoryArticles,
    thirdCategoryArticles,
    sortBy,
  ]);

  const isLoading =
    categoriesLoading ||
    firstCategoryLoading ||
    secondCategoryLoading ||
    thirdCategoryLoading;

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth * 0.8; // Scroll 80% of container width
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
      <div className="text-center mb-6 sm:mb-8 md:mb-10">
        {/* Badge - White background, black text */}
        <div className="inline-block rounded-full px-4 py-3 sm:px-6 sm:py-3 bg-white dark:bg-white mb-4">
          <span className="text-lg font-medium text-black dark:text-black">Tin tức mới nhất</span>
        </div>
        {/* Headline with dropdown */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 sm:gap-4">
          <div className="flex items-center gap-2 rounded-full border border-border/60 bg-white/80 px-2 py-1 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
            {[
              { value: "all", label: "Tất cả" },
              ...displayCategories.map((category) => ({
                value: category.slug,
                label: category.name,
              })),
            ].map((opt) => {
              const active = sortBy === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSortBy(opt.value)}
                  className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all ${active
                      ? "bg-gradient-to-r from-[#7042E1] to-[#A084FB] text-white shadow-[0_6px_18px_rgba(112,66,225,0.25)]"
                      : "text-foreground/70 hover:text-foreground bg-transparent"
                    }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative group">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <EmptyState
              title="Đang tải dữ liệu"
              description="Vui lòng chờ trong giây lát..."
              icon={<Newspaper className="h-6 w-6" />}
            />
          </div>
        ) : allArticles.length === 0 ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <EmptyState
              title="Chưa có tin tức"
              description="Các tin tức mới sẽ được cập nhật tại đây."
              icon={<Newspaper className="h-6 w-6" />}
            />
          </div>
        ) : (
          <>
            {/* Carousel Container */}
            <div
              ref={carouselRef}
              className="flex gap-4 sm:gap-5 md:gap-6 overflow-x-auto scroll-smooth scrollbar-hide snap-x snap-mandatory pb-4"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {allArticles.map((article) => (
                <Link
                  key={`${article.categorySlug}-${article.id}`}
                  href={buildArticleHref(article.categorySlug, article.slug)}
                  className="group/article flex-shrink-0 w-[85%] sm:w-[45%] md:w-[38%] lg:w-[32%] rounded-xl overflow-hidden bg-background/70 border border-border hover:shadow-lg transition-shadow flex flex-col h-full snap-start"
                >
                  <div className="relative w-full h-40 sm:h-44 md:h-52 overflow-hidden">
                    <Image
                      src={getImage(article)}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover/article:scale-[1.05]"
                      sizes="(max-width: 640px) 85vw, (max-width: 768px) 45vw, (max-width: 1024px) 38vw, 32vw"
                    />
                  </div>
                  <div className="p-3 sm:p-4 md:p-5 space-y-3 flex-1 flex flex-col">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-[10px] sm:text-xs inline-flex items-center rounded-md px-2 sm:px-2.5 py-0.5 sm:py-1 bg-[color:var(--title)]/15 text-[color:var(--title)] font-medium">
                        {article.tag?.name ??
                          getArticleCategoryDisplayName(
                            article.category?.slug,
                            article.category?.name ?? "Tin tức",
                          )}
                      </div>
                      <div className="text-[10px] sm:text-xs text-foreground/60 whitespace-nowrap">
                        {formatDate(article.publishedAt)}
                      </div>
                    </div>
                    <h3 className="text-sm sm:text-base font-semibold text-foreground leading-tight line-clamp-2 min-h-[2.75rem] sm:min-h-[2.5rem]">
                      {article.title}
                    </h3>
                    {article.description ? (
                      <p className="text-xs sm:text-sm text-foreground/70 line-clamp-2 min-h-[2.75rem] sm:min-h-[2.5rem]">
                        {article.description}
                      </p>
                    ) : (
                      <p className="text-xs sm:text-sm text-foreground/70 line-clamp-2 min-h-[2.75rem] sm:min-h-[2.5rem]">
                        &nbsp;
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
            {/* Navigation Buttons */}
            {allArticles.length > 1 && (
              <>
                <button
                  onClick={() => scrollCarousel('left')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-6 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all opacity-100"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button
                  onClick={() => scrollCarousel('right')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-6 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all opacity-100"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}
