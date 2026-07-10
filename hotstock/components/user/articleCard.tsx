"use client";

import { useMemo, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/types/iReport";
import {
  getArticleCategoryDisplayName,
} from "@/types/iReport";

interface ArticleCardProps {
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

export const ArticleCard = memo(function ArticleCard({ article, fallbackCategorySlug }: ArticleCardProps) {
  const categorySlug = article.category?.slug || fallbackCategorySlug;
  
  // Memoize href để tránh tính toán lại mỗi lần render
  const href = useMemo(() => {
    if (categorySlug) {
      return `/news/${categorySlug}/${article.slug}`;
    }
    return "#";
  }, [categorySlug, article.slug]);

  // Memoize sorted plans để tránh sort lại mỗi lần render
  const plans = useMemo(() => {
    return [...article.plans].sort((a, b) => a.level - b.level);
  }, [article.plans]);

  return (
    <Link href={href} className="block h-full">
      <article className="relative rounded-2xl backdrop-blur-sm bg-card/80 dark:bg-[rgba(255,255,255,0.03)] border border-[rgba(112,66,225,0.3)] dark:border-[rgba(160,132,251,0.6)] overflow-hidden shadow-[0_0_10px_rgba(112,66,225,0.2)] dark:shadow-[0_0_15px_rgba(160,132,251,0.4)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(112,66,225,0.3)] dark:hover:shadow-[0_0_25px_rgba(160,132,251,0.7)] h-full flex flex-col">
        <div className="p-4 flex flex-col h-full">
          <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4 bg-muted/50">
            {article.coverUrl ? (
              <Image
                src={article.coverUrl}
                alt={article.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            ) : null}
          </div>

          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-[11px] inline-flex items-center rounded-full px-2 py-0.5 bg-[color:var(--title)]/15 text-[color:var(--title)] font-medium">
              {article.tag?.name ??
                getArticleCategoryDisplayName(
                  article.category?.slug,
                  article.category?.name ?? "Tin tức",
                )}
            </span>
            <span className="text-[11px] text-foreground/60 whitespace-nowrap">
              {formatDate(article.publishedAt)}
            </span>
          </div>

          <h3 className="text-base font-semibold text-foreground leading-tight line-clamp-2 mb-2 min-h-[2.5rem]">
            {article.title}
          </h3>
          <p className="text-sm text-foreground/70 line-clamp-2 leading-5 min-h-[2.5rem] mb-4">
            {article.description || "Khám phá thêm để xem chi tiết báo cáo này."}
          </p>

          {plans.length > 0 && (
            <div className="mt-auto flex flex-wrap gap-2 pt-2">
              {plans.map((plan) => (
                <span
                  key={plan.id}
                  className="text-[11px] uppercase tracking-wide rounded-full border border-border/60 px-2 py-0.5 text-muted-foreground"
                >
                  {plan.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
});

