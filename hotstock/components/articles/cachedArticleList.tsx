"use cache";

import { getArticlesByCategoryAction } from "@/app/actions/articles";
import { ArticleCard } from "@/components/user/articleCard";
import type { ArticleCategorySlug } from "@/types/iReport";

interface CachedArticleListProps {
  category: ArticleCategorySlug;
}

/**
 * Component sử dụng "use cache" directive của Next.js 16
 * Component này sẽ được cache và chỉ re-render khi cache được invalidate
 */
export async function CachedArticleList({ category }: CachedArticleListProps) {
  const result = await getArticlesByCategoryAction(category);

  // Nếu Server Action trả về lỗi
  if (!result.success) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          {result.error || "Không thể tải danh sách bài viết."}
        </p>
      </div>
    );
  }

  const articles = result.data;

  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Không có bài viết nào trong danh mục này.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}

