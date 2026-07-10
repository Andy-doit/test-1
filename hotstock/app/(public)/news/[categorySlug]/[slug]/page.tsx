"use client";

import { Suspense, use } from "react";
import { ArticleDetail } from "@/components/user/articleDetail";
import { ArticleSkeleton } from "@/components/common/articleSkeleton";
import { useArticleQuery } from "@/hooks/useArticleQuery";

interface DynamicArticlePageProps {
  params: Promise<{ categorySlug: string; slug: string }>;
}

export default function DynamicArticlePage(props: DynamicArticlePageProps) {
  return (
    <Suspense fallback={<ArticleSkeleton />}>
      <DynamicArticlePageContent params={props.params} />
    </Suspense>
  );
}

function DynamicArticlePageContent({
  params,
}: {
  params: Promise<{ categorySlug: string; slug: string }>;
}) {
  const { categorySlug, slug } = use(params);
  const { data: article, isLoading, error } = useArticleQuery(slug);

  if (isLoading) {
    return <ArticleSkeleton />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <ArticleDetail
      article={article ?? null}
      isLoading={isLoading}
      error={error ?? null}
      categorySlug={categorySlug}
    />
  );
}
