"use client";
import { useMemo, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/types/iReport";
import {
  getArticleCategoryDisplayName,
} from "@/types/iReport";
import { Calendar, ArrowRight } from "lucide-react";

interface FeaturedArticleProps {
  article: Article;
  fallbackCategorySlug?: string;
}
const formatDate = (value?: string) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const FeaturedArticle = memo(function FeaturedArticle({ article, fallbackCategorySlug }: FeaturedArticleProps) {
  const categorySlug = article.category?.slug || fallbackCategorySlug;
  const href = useMemo(() => 
    categorySlug
      ? `/news/${categorySlug}/${article.slug}`
      : "#"
  , [categorySlug, article.slug]);
  const plans = useMemo(() => [...article.plans].sort((a, b) => a.level - b.level), [article.plans]);

  return (
    <Link href={href} className="block group">
      <article className="relative backdrop-blur-sm bg-card dark:bg-[rgba(255,255,255,0.02)] rounded-3xl border border-[rgba(112,66,225,0.3)] dark:border-[rgba(160,132,251,0.6)] overflow-hidden shadow-[0_0_10px_rgba(112,66,225,0.25)] dark:shadow-[0_0_20px_rgba(160,132,251,0.4)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(112,66,225,0.35)]">
        <div className="relative p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            <div className="relative w-full h-full min-h-[320px] lg:min-h-[420px] rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-800">
              {article.coverUrl ? (
                <Image
                  src={article.coverUrl}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : null}
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                {article.tag?.name && (
                  <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-[#6B21A8]/10 dark:bg-[#A78BFA]/20 text-[#6B21A8] dark:text-[#A78BFA] border border-[#6B21A8]/20 dark:border-[#A78BFA]/30">
                    {article.tag.name}
                  </span>
                )}
              {article.category?.slug && (
                  <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-white/10 dark:bg-white/5 text-foreground border border-white/20">
                  {getArticleCategoryDisplayName(
                    article.category.slug,
                    article.category.name,
                  )}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(article.publishedAt)}
                </span>
              </div>

              <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-4 tracking-tight group-hover:text-[#6B21A8] dark:group-hover:text-[#A78BFA] transition-colors duration-300">
                {article.title}
              </h1>

              {article.description && (
                <p className="text-gray-600 dark:text-gray-300 text-base lg:text-lg leading-relaxed mb-6 line-clamp-4">
                  {article.description}
                </p>
              )}

              {plans.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {plans.map((plan) => (
                    <span
                      key={plan.id}
                      className="inline-flex items-center rounded-full border border-[#6B21A8]/30 dark:border-[#A78BFA]/40 px-3 py-1 text-xs font-semibold text-[#6B21A8] dark:text-[#A78BFA]"
                    >
                      {plan.name}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-auto pt-6 border-t border-gray-200/60 dark:border-gray-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Lần cập nhật gần nhất
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(article.updatedAt)}
                  </p>
                </div>

                <div
                  className="inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium group/btn border border-[#6B21A8]/30 dark:border-[#A78BFA]/30 text-[#6B21A8] dark:text-[#A78BFA] group-hover:bg-[#6B21A8] group-hover:text-white dark:group-hover:bg-[#A78BFA] dark:group-hover:text-gray-900 transition-all duration-300"
                >
                  <span className="flex items-center gap-2">
                    Xem chi tiết
                    <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#6B21A8]/20 dark:via-[#A78BFA]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </article>
    </Link>
  );
});

