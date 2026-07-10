"use client";

import type { JSX } from "react";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ClipboardSignature, Newspaper } from "lucide-react";
import { EmptyState } from "@/components/common/emptyState";
import type { Article, ArticleCategorySlug } from "@/types/iReport";
import { getArticleCategoryDisplayName } from "@/types/iReport";
import { useArticlesQuery } from "@/hooks/useArticlesQuery";
import type { Category } from "@/lib/services/categoriesService";

const FALLBACK_IMAGE = "/homePage/banner.jpg";
const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

const formatDate = (value?: string) => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
};

const buildArticleHref = (category: ArticleCategorySlug, slug: string) =>
  `/news/${category}/${slug}`;

const getImage = (article?: Article) => article?.coverUrl ?? FALLBACK_IMAGE;

const renderArticleGrid = (
  category: ArticleCategorySlug,
  articles: Article[],
  isLoading: boolean,
  error: Error | null,
  emptyTitle: string,
  emptyDescription: string,
  icon: JSX.Element,
) => {
  if (isLoading) {
    return (
      <EmptyState
        title="Đang tải dữ liệu"
        description="Vui lòng chờ trong giây lát..."
        icon={icon}
      />
    );
  }

  if (error) {
    return (
      <EmptyState
        title="Không thể tải dữ liệu"
        description="Có lỗi xảy ra khi đồng bộ bài viết. Thử lại sau nhé."
        icon={icon}
      />
    );
  }

  if (!articles.length) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        icon={icon}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:gap-6 xl:grid-cols-3">
      {articles.map((article) => (
        <Link
          key={article.id}
          href={buildArticleHref(article.category?.slug ?? category, article.slug)}
          className="group rounded-xl overflow-hidden bg-background/70 border border-border hover:shadow-lg transition-shadow flex flex-col h-full"
        >
          <div className="relative w-full h-40 sm:h-44 md:h-52 overflow-hidden">
            <Image
              src={getImage(article)}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
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
  );
};

export const CategoryBlockLeft = memo(function CategoryBlockLeft({ category, title, setRef }: { category: string, title: string, setRef: React.RefObject<HTMLElement | null> }) {
  const { data: articles = [], isLoading, error } = useArticlesQuery(category, { limit: 3 });

  return (
    <section
      ref={setRef}
      className="relative rounded-2xl bg-card/60 border border-[rgba(112,66,225,0.3)] dark:border-[rgba(160,132,251,0.6)] backdrop-blur-md px-3 sm:px-4 py-3 sm:py-4 shadow-[0_0_10px_rgba(112,66,225,0.2)] dark:shadow-[0_0_15px_rgba(160,132,251,0.4)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(112,66,225,0.3)] dark:hover:shadow-[0_0_25px_rgba(160,132,251,0.7)] overflow-hidden flex flex-col"
    >
      <header className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-b border-border/60 font-bold text-base sm:text-lg text-[#5B21B6] dark:text-[#C084FC] dark:drop-shadow-[0_0_12px_rgba(124,58,237,0.6)]">
        {title}
      </header>
      <div className="p-3 sm:p-4 md:p-6 flex-1 min-h-0">
        {renderArticleGrid(
          category,
          articles,
          isLoading,
          error,
          `Chưa có ${title.toLowerCase()}`,
          "Dữ liệu sẽ được hiển thị tại đây ngay khi có cập nhật mới.",
          <Newspaper className="h-6 w-6" />,
        )}
      </div>
    </section>
  );
});

export function CategoryBlockRight({ category, title, height }: { category: string, title: string, height?: number }) {
  const { data: articles = [], isLoading, error } = useArticlesQuery(category, { limit: 6 });
  
  if (!isLoading && !error) {
    // Hide the block entirely when there is no data
    if (articles.length === 0) {
      return null;
    }

    // "Tin tổng hợp": chỉ hiện khi có trên 3 bài viết ở 3 danh mục khác nhau
    if (category === "all") {
      const uniqueCategories = new Set(
        articles.map((a) => a.category?.slug).filter(Boolean)
      );
      if (articles.length <= 3 || uniqueCategories.size < 3) {
        return null;
      }
    }
  }

  return (
    <section
      className="relative rounded-2xl border border-[rgba(112,66,225,0.3)] dark:border-[rgba(160,132,251,0.6)] bg-card/60 dark:bg-[rgba(255,255,255,0.05)] backdrop-blur-md px-3 sm:px-4 py-3 sm:py-4 shadow-[0_0_10px_rgba(112,66,225,0.2)] dark:shadow-[0_0_15px_rgba(160,132,251,0.4)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(112,66,225,0.3)] dark:hover:shadow-[0_0_25px_rgba(160,132,251,0.7)] overflow-hidden flex flex-col"
      style={height ? { height } : undefined}
    >
      <header className="px-3 sm:px-4 py-2.5 sm:py-3 border-b border-border/60 font-bold flex-shrink-0 text-sm sm:text-base text-[#5B21B6] dark:text-[#C084FC] dark:drop-shadow-[0_0_12px_rgba(124,58,237,0.6)]">
        {title}
      </header>
      <div className="p-2 sm:p-3 space-y-2 sm:space-y-3 overflow-y-auto flex-1 scrollbar-hide min-h-0">
        {isLoading && (
          <div className="flex h-full items-center">
            <EmptyState
              title="Đang tải dữ liệu"
              description="Đang truy vấn các báo cáo mới nhất..."
              icon={<ClipboardSignature className="h-6 w-6" />}
              className="mx-auto max-w-sm"
            />
          </div>
        )}

        {!isLoading && error && (
          <div className="flex h-full items-center">
            <EmptyState
              title="Không thể tải dữ liệu"
              description="Có lỗi xảy ra. Thử lại sau."
              icon={<ClipboardSignature className="h-6 w-6" />}
              className="mx-auto max-w-sm"
            />
          </div>
        )}

        {!isLoading && !error && articles.length === 0 && (
          <div className="flex h-full items-center">
            <EmptyState
              title="Chưa có dữ liệu"
              description="Các bản tin chuyên sâu sẽ được bổ sung sớm nhất."
              icon={<ClipboardSignature className="h-6 w-6" />}
              className="mx-auto max-w-sm"
            />
          </div>
        )}

        {!isLoading &&
          !error &&
          articles.length > 0 &&
          articles.map((article) => (
            <Link
              key={article.id}
              href={buildArticleHref(article.category?.slug ?? category, article.slug)}
              className="relative rounded-xl bg-background/70 border border-border overflow-hidden p-2 sm:p-3 grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-3 sm:gap-4 hover:border-[rgba(112,66,225,0.5)] transition-colors"
            >
              <div className="relative w-full h-full min-h-[100px] sm:min-h-[120px] rounded-lg overflow-hidden">
                <Image
                  src={getImage(article)}
                  alt={article.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 160px"
                />
              </div>
              <div className="flex flex-col justify-between">
                <div className="text-[9px] sm:text-[10px] inline-flex items-center self-start rounded-full px-1.5 sm:px-2 py-0.5 bg-[color:var(--title)]/15 text-[color:var(--title)]">
                  {article.tag?.name ?? "Báo cáo"}
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-foreground mt-1 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-[10px] sm:text-xs text-foreground/70 line-clamp-2 mt-1">
                  {article.description || "Đọc chi tiết báo cáo để xem thêm thông tin."}
                </p>
                <div className="mt-2 sm:mt-3">
                  <span className="inline-flex items-center rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-[12px] bg-[color:var(--title)]/15 text-[color:var(--title)]">
                    Xem chi tiết
                  </span>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </section>
  );
}

export function NewsPageClient({ initialCategories }: { initialCategories: Category[] }) {
  const hasMounted = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  // PERF: [MEMO] Slice and filter are cheap but keeping this stable avoids
  // downstream components re-rendering when parent re-renders without data changes.
  const displayCategories = useMemo(
    () => initialCategories.filter((c) => c.isVisibleOnUI !== false).slice(0, 3),
    [initialCategories],
  );

  const leftTopRef = useRef<HTMLElement>(null);
  const leftBottomRef = useRef<HTMLElement>(null);
  const [rightTopHeight, setRightTopHeight] = useState<number>();
  const [rightBottomHeight, setRightBottomHeight] = useState<number>();

  // PERF: [MEMO] useCallback prevents the effect from seeing a stale closure
  // and keeps the ResizeObserver/window listener pointing at the same function
  // reference across renders — avoiding memory leaks from stale listeners.
  const updateHeights = useCallback(() => {
    if (leftTopRef.current) {
      setRightTopHeight(leftTopRef.current.getBoundingClientRect().height);
    }
    if (leftBottomRef.current) {
      setRightBottomHeight(leftBottomRef.current.getBoundingClientRect().height);
    }
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    updateHeights();
    const timeout = setTimeout(updateHeights, 100);

    const resizeObserver = new ResizeObserver(updateHeights);
    if (leftTopRef.current) resizeObserver.observe(leftTopRef.current);
    if (leftBottomRef.current) resizeObserver.observe(leftBottomRef.current);
    window.addEventListener("resize", updateHeights);

    return () => {
      clearTimeout(timeout);
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateHeights);
    };
  }, [displayCategories, hasMounted, updateHeights]);

  if (!hasMounted) {
    return (
      <section className="relative min-h-[100vh] overflow-hidden py-25">
        <div className="absolute inset-0 -z-10" />
        <div className="relative z-10 mx-auto max-w-[1600px] px-4 sm:px-6 md:px-8 space-y-4 sm:space-y-5 md:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 md:gap-6">
            <div className="lg:col-span-8 space-y-4 sm:space-y-5 md:space-y-6">
              <section className="relative rounded-2xl bg-card/60 border border-[rgba(112,66,225,0.3)] dark:border-[rgba(160,132,251,0.6)] backdrop-blur-md px-3 sm:px-4 py-3 sm:py-4 shadow-[0_0_10px_rgba(112,66,225,0.2)] dark:shadow-[0_0_15px_rgba(160,132,251,0.4)] overflow-hidden">
                <EmptyState
                  title="Đang tải dữ liệu"
                  description="Vui lòng chờ trong giây lát..."
                  icon={<Newspaper className="h-6 w-6" />}
                />
              </section>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-[100vh] overflow-hidden py-25">
      <div className="absolute inset-0 -z-10" />
      <div className="relative z-10 mx-auto max-w-[1600px] px-4 sm:px-6 md:px-8 space-y-4 sm:space-y-5 md:space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 md:gap-6">
          <div className="lg:col-span-8 space-y-4 sm:space-y-5 md:space-y-6">
            {displayCategories[0] && (
              <CategoryBlockLeft
                category={displayCategories[0].slug}
                title={displayCategories[0].name}
                setRef={leftTopRef}
              />
            )}
            {displayCategories[1] && (
              <CategoryBlockLeft
                category={displayCategories[1].slug}
                title={displayCategories[1].name}
                setRef={leftBottomRef}
              />
            )}
          </div>

          <aside className="lg:col-span-4 space-y-4 sm:space-y-5 md:space-y-6">
            {displayCategories[2] && (
              <CategoryBlockRight
                category={displayCategories[2].slug}
                title={displayCategories[2].name}
                height={rightTopHeight}
              />
            )}
            <CategoryBlockRight
              category="all"
              title="Tin tổng hợp"
              height={rightBottomHeight}
            />
          </aside>
        </div>

        <section className="relative z-10 mt-16 overflow-hidden rounded-[32px] border border-[rgba(112,66,225,0.22)] bg-white/90 px-3 py-3 shadow-[0_10px_35px_rgba(15,23,42,0.08)] transition-all duration-300 hover:shadow-[0_20px_45px_rgba(15,23,42,0.12)] dark:border-[rgba(160,132,251,0.6)] dark:bg-[rgba(5,3,18,0.92)] dark:px-4 dark:py-4 dark:shadow-[0_0_20px_rgba(160,132,251,0.35)]">
          <div className="px-4 py-6 sm:px-6 md:px-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-bold text-base sm:text-lg text-[#5B21B6] dark:text-[#C084FC] dark:drop-shadow-[0_0_12px_rgba(124,58,237,0.6)]">
                  Lịch kinh tế
                </p>
                <h2 className="text-2xl font-bold text-foreground md:text-3xl dark:text-white">
                  Sự kiện vĩ mô trong tuần
                </h2>
              </div>
              <div className="text-sm text-muted-foreground dark:text-white/70">
                Dữ liệu nhúng trực tiếp từ Investing.com Việt Nam
              </div>
            </div>
          </div>
          <div className="px-4 pb-6 sm:px-6 md:px-8">
            <div className="rounded-[28px] border border-[rgba(112,66,225,0.22)] bg-white shadow-[0_10px_35px_rgba(15,23,42,0.08)] dark:border-[rgba(160,132,251,0.6)] dark:bg-black/40 dark:shadow-[0_0_20px_rgba(160,132,251,0.35)]">
              <iframe
                src="https://sslecal2.investing.com?defaultFont=%230d0000&columns=exc_flags,exc_currency,exc_importance,exc_actual,exc_forecast,exc_previous&features=datepicker,timezone&countries=33,14,4,34,38,32,6,11,51,5,39,72,60,110,43,35,71,22,36,26,12,9,37,25,178,10,17&calType=week&timeZone=27&lang=52"
                width="100%"
                height="467"
                frameBorder="0"
                style={{
                  width: "100%",
                  height: "467px",
                  border: "0"
                }}
                marginWidth={0}
                marginHeight={0}
                className="w-full rounded-[24px]"
              />
            </div>
            <p className="mt-3 text-center text-xs text-muted-foreground dark:text-white/70">
              Lịch Kinh Tế theo Thời Gian Thực được cung cấp bởi{" "}
              <Link
                href="https://vn.Investing.com/"
                rel="nofollow"
                target="_blank"
                className="font-semibold text-[#5B21B6] underline hover:text-[#4c1d95] dark:text-[#C084FC]"
              >
                Investing.com Việt Nam
              </Link>
            </p>
          </div>
        </section>
      </div>
    </section>
  );
}
