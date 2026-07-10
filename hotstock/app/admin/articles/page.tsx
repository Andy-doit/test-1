"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAdminArticles } from "@/hooks/admin/useAdminArticles";
import { DataTable } from "@/components/admin/dataTable";
import { AdminPageHeader } from "@/components/admin/shared/adminPageHeader";
import { AdminErrorState } from "@/components/admin/shared/adminErrorState";
import { isArticlePublished } from "@/components/admin/shared/statusBadge";
import { buildArticleColumns } from "./_components/articleColumns";
import { ArticleFilters } from "./_components/articleFilters";

export default function AdminArticlesPage() {
  const { articles, isLoading, error, deleteArticle } = useAdminArticles();

  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterAuthor, setFilterAuthor] = useState("all");

  const handleDelete = useCallback(async (slug: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) {
      await deleteArticle(slug);
    }
  }, [deleteArticle]);

  const uniqueCategories = useMemo(
    () => Array.from(new Set(articles?.map((a) => a.category?.name || "Chưa phân loại") ?? [])),
    [articles]
  );

  const uniqueAuthors = useMemo(
    () => Array.from(new Set(articles?.map((a) => a.author?.name || "Hệ thống") ?? [])),
    [articles]
  );

  const filteredArticles = useMemo(() => {
    if (!articles) return [];
    return articles.filter((a) => {
      const status = isArticlePublished(a.publishedAt) ? "published" : "draft";
      if (filterStatus !== "all" && status !== filterStatus) return false;
      if (filterCategory !== "all" && (a.category?.name || "Chưa phân loại") !== filterCategory) return false;
      if (filterAuthor !== "all" && (a.author?.name || "Hệ thống") !== filterAuthor) return false;
      return true;
    });
  }, [articles, filterStatus, filterCategory, filterAuthor]);

  const columns = useMemo(() => buildArticleColumns({ onDelete: handleDelete }), [handleDelete]);

  if (error) return <AdminErrorState message={`Lỗi tải danh sách bài viết: ${(error as Error).message}`} />;

  const pageVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="show" className="space-y-8 pb-12">
      <AdminPageHeader
        title="Bài viết"
        description="Quản lý và xuất bản nội dung của bạn."
        action={
          <Button asChild className="border-[#222] hover:border-[#c084fc] bg-[#c084fc] hover:bg-[#a855f7] text-black font-black uppercase tracking-widest text-[11px] h-9 transition-colors rounded-none shadow-[4px_4px_0_#222] hover:shadow-[4px_4px_0_#a855f7] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none">
            <Link href="/admin/articles/create" className="flex items-center gap-2">
              <Plus size={16} /> Tạo bài viết mới
            </Link>
          </Button>
        }
      />

      <motion.div variants={itemVariants}>
        <Card className="bg-[#000000] border border-[#222] shadow-[4px_4px_0_#222] rounded-none">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-12 text-center text-[#888] text-[13px]">Đang tải dữ liệu...</div>
          ) : (
            <div className="p-5 space-y-4">
              <ArticleFilters
                filterStatus={filterStatus}
                filterCategory={filterCategory}
                filterAuthor={filterAuthor}
                categories={uniqueCategories}
                authors={uniqueAuthors}
                onStatusChange={setFilterStatus}
                onCategoryChange={setFilterCategory}
                onAuthorChange={setFilterAuthor}
              />
              <DataTable
                columns={columns}
                data={filteredArticles}
                searchKey="title"
                searchPlaceholder="Tìm bài viết theo tiêu đề..."
              />
            </div>
          )}
        </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

