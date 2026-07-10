"use client";

import { useState } from "react";
import { DataTable } from "@/components/admin/dataTable";
import { useAdminTags, Tag } from "@/hooks/admin/useAdminTags";
import TagFormSheet from "./tagFormSheet";
import { getTagColumns } from "./_components/tagColumns";
import { AdminPageHeader } from "@/components/admin/shared/adminPageHeader";
import { AdminErrorState } from "@/components/admin/shared/adminErrorState";
import { Plus } from "lucide-react";
import { logger } from "@/lib/utils/logger";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function AdminTagsPage() {
  const { tags, isLoading, error, deleteTag } = useAdminTags();
  
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);

  const handleEdit = (tag: Tag) => {
    setSelectedTag(tag);
    setIsSheetOpen(true);
  };

  const handleCreate = () => {
    setSelectedTag(null);
    setIsSheetOpen(true);
  };

  const handleDelete = async (slug: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa thẻ (Tag) này? Các bài viết liên kết với thẻ này sẽ tự động gỡ thẻ ra khỏi bài.")) {
      try {
        await deleteTag.mutateAsync(slug);
      } catch (error) {
        logger.error("[AdminTags] Failed to delete tag:", error);
        alert("Không thể xóa thẻ này. Vui lòng thử lại sau.");
      }
    }
  };

  const columns = getTagColumns({
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
        title="Thẻ (Tags)"
        description="Quản lý các thẻ được gắn vào bài viết."
        action={
          <Button onClick={handleCreate} className="border-[#222] hover:border-[#c084fc] bg-[#c084fc] hover:bg-[#a855f7] text-black font-black uppercase tracking-widest text-[11px] h-9 transition-colors rounded-none shadow-[4px_4px_0_#222] hover:shadow-[4px_4px_0_#a855f7] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none gap-2">
            <Plus size={16} /> Thêm Thẻ
          </Button>
        }
      />

      <motion.div variants={itemVariants} className="bg-[#000000] border border-[#222] shadow-[4px_4px_0_#222] rounded-none p-5">
        <DataTable
          columns={columns}
          data={tags}
          isLoading={isLoading}
          searchKey="name"
          searchPlaceholder="Tìm kiếm theo tên thẻ..."
        />
      </motion.div>

      {isSheetOpen && (
        <TagFormSheet
          isOpen={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          initialData={selectedTag}
        />
      )}
    </motion.div>
  );
}
