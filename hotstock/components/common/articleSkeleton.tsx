"use client";

import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton loader cho Article Detail page
 */
export function ArticleSkeleton() {
  return (
    <article className="relative min-h-screen py-8 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* Breadcrumb skeleton */}
        <nav className="mb-6">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-1" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-1" />
            <Skeleton className="h-4 w-48" />
          </div>
        </nav>

        {/* Header skeleton */}
        <header className="mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-32 rounded-full" />
          </div>

          {/* Title skeleton */}
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-12 w-4/5 mb-6" />

          {/* Description skeleton */}
          <div className="space-y-2 mb-8">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
          </div>

          {/* Author and plans skeleton */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 border-b border-gray-200/60 dark:border-gray-800/60">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </div>

          {/* Cover image skeleton */}
          <Skeleton className="w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-3xl mt-8" />
        </header>

        {/* Content skeleton */}
        <div className="space-y-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

/**
 * Skeleton loader cho Article Card (dùng trong list/carousel)
 */
export function ArticleCardSkeleton() {
  return (
    <article className="relative rounded-2xl backdrop-blur-sm bg-card/80 dark:bg-[rgba(255,255,255,0.03)] border border-[rgba(112,66,225,0.3)] dark:border-[rgba(160,132,251,0.6)] overflow-hidden shadow-[0_0_10px_rgba(112,66,225,0.2)] dark:shadow-[0_0_15px_rgba(160,132,251,0.4)] h-full flex flex-col">
      <div className="p-4 flex flex-col h-full">
        {/* Image skeleton */}
        <Skeleton className="w-full h-48 rounded-lg mb-4" />

        {/* Tags and date skeleton */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Title skeleton */}
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-4/5 mb-4" />

        {/* Description skeleton */}
        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        {/* Plans skeleton */}
        <div className="mt-auto flex gap-2 pt-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>
    </article>
  );
}

