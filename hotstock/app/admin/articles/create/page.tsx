"use client";

import { useAdminArticles } from "@/hooks/admin/useAdminArticles";
import dynamic from "next/dynamic";
const ArticleEditor = dynamic(() => import("@/components/admin/articleEditor").then(mod => mod.ArticleEditor), { ssr: false });
import { useRouter } from "next/navigation";
import type { AdminArticle } from "@/hooks/admin/useAdminArticles";

export default function CreateArticlePage() {
  const { createArticle, isCreating } = useAdminArticles();
  const router = useRouter();

  const handleSave = async (payload: Partial<AdminArticle>) => {
    try {
      await createArticle(payload);
      router.push("/admin/articles");
    } catch {
      // Error handled in hook
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 border-b-2 border-[#222] pb-4">
        <h2 className="text-[#ffffff] text-[24px] font-black uppercase tracking-widest">Tạo bài viết mới</h2>
        <p className="text-[12px] font-medium text-[#888] mt-1">Soạn thảo và đăng bài viết lên nền tảng.</p>
      </div>

      <ArticleEditor 
        onSave={handleSave} 
        isLoading={isCreating} 
      />
    </div>
  );
}
