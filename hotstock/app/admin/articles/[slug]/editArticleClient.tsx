"use client";

import { useAdminArticles, useAdminArticle, type AdminArticle } from "@/hooks/admin/useAdminArticles";
import dynamic from "next/dynamic";
const ArticleEditor = dynamic(() => import("@/components/admin/articleEditor").then(mod => mod.ArticleEditor), { ssr: false });
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function EditArticleClient({ slug }: { slug: string }) {
  const { data: article, isLoading: isLoadingArticle, error } = useAdminArticle(slug);
  const { updateArticle, isUpdating } = useAdminArticles();
  const router = useRouter();

  const handleSave = async (payload: Partial<AdminArticle>) => {
    try {
      await updateArticle({ slug, payload });
      router.push("/admin/articles");
    } catch {
      // Error handled in hook
    }
  };

  if (isLoadingArticle) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground space-y-4">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p>Đang tải thông tin bài viết...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="p-6 bg-red-50/50 border border-red-100 rounded-xl text-red-600">
        Đã có lỗi xảy ra hoặc không tìm thấy bài viết.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 border-b-2 border-[#222] pb-4">
        <h2 className="text-[#ffffff] text-[24px] font-black uppercase tracking-widest">Chỉnh sửa bài viết</h2>
        <p className="text-[12px] font-medium text-[#888] mt-1">
          Cập nhật nội dung cho bài viết &quot;{article.title}&quot;
        </p>
      </div>

      <ArticleEditor 
        initialData={article}
        onSave={handleSave} 
        isLoading={isUpdating} 
      />
    </div>
  );
}
