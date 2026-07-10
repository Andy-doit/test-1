"use client";

import { useMemo } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ArticleCard } from "./articleCard";
import type { Article } from "@/types/iReport";

interface ArticleCarouselProps {
  articles: Article[];
  fallbackCategorySlug?: string;
}

export function ArticleCarousel({ articles, fallbackCategorySlug }: ArticleCarouselProps) {
  // Memoize carousel options để tránh tạo object mới mỗi lần render
  const carouselOptions = useMemo(
    () => ({
      align: "start" as const,
      loop: false,
    }),
    []
  );

  if (articles.length === 0) {
    return null;
  }

  return (
    <div className="relative mt-16">
      <Carousel opts={carouselOptions} className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {articles.map((article) => (
            <CarouselItem
              key={article.id}
              className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
            >
              <div className="pb-16">
                <ArticleCard article={article} fallbackCategorySlug={fallbackCategorySlug} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-12 bg-white/90 dark:bg-gray-800/90 border-2 border-[#6B21A8] dark:border-[#A78BFA] text-[#6B21A8] dark:text-[#A78BFA] hover:bg-[#6B21A8] hover:text-white dark:hover:bg-[#A78BFA] dark:hover:text-white shadow-lg" />
        <CarouselNext className="-right-12 bg-white/90 dark:bg-gray-800/90 border-2 border-[#6B21A8] dark:border-[#A78BFA] text-[#6B21A8] dark:text-[#A78BFA] hover:bg-[#6B21A8] hover:text-white dark:hover:bg-[#A78BFA] dark:hover:text-white shadow-lg" />
      </Carousel>
    </div>
  );
}

