"use client";

import { useState } from "react";
import { DataTable } from "@/components/admin/dataTable";
import { useAdminCategories, useDeleteCategory, Category } from "@/hooks/admin/useAdminCategories";
import CategoryFormSheet from "./categoryFormSheet";
import { getCategoryColumns } from "./_components/categoryColumns";
import { AdminPageHeader } from "@/components/admin/shared/adminPageHeader";
import { AdminErrorState } from "@/components/admin/shared/adminErrorState";
import { Plus } from "lucide-react";
import { logger } from "@/lib/utils/logger";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function AdminCategoriesPage() {
  const { data: categoriesData, isLoading, error } = useAdminCategories();
  const deleteMutation = useDeleteCategory();
  
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsSheetOpen(true);
  };

  const handleCreate = () => {
    setSelectedCategory(null);
    setIsSheetOpen(true);
  };

  const handleDelete = async (slug: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      try {
        await deleteMutation.mutateAsync(slug);
      } catch (error) {
        logger.error("[AdminCategories] Failed to delete category:", error);
        alert("Không thể xóa danh mục này. Có thể nó đang chứa bài viết.");
      }
    }
  };

  const columns = getCategoryColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  if (error) {
    return <AdminErrorState error={error} />;
  }

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
        title="Danh mục"
        description="Quản lý các chuyên mục bài viết."
        action={
          <Button onClick={handleCreate} className="border-[#222] hover:border-[#c084fc] bg-[#c084fc] hover:bg-[#a855f7] text-black font-black uppercase tracking-widest text-[11px] h-9 transition-colors rounded-none shadow-[4px_4px_0_#222] hover:shadow-[4px_4px_0_#a855f7] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none gap-2">
            <Plus size={16} /> Thêm Danh mục
          </Button>
        }
      />

      <motion.div variants={itemVariants} className="bg-[#000000] border border-[#222] shadow-[4px_4px_0_#222] rounded-none p-5">
        <DataTable
          columns={columns}
          data={categoriesData || []}
          isLoading={isLoading}
          searchKey="name"
          searchPlaceholder="Tìm kiếm theo tên danh mục..."
        />
      </motion.div>

      {isSheetOpen && (
        <CategoryFormSheet
          isOpen={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          initialData={selectedCategory}
        />
      )}
    </motion.div>
  );
}
