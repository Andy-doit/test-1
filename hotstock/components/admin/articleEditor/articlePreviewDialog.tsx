"use client";

import { ArticleDetail } from "@/components/user/articleDetail";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ArticleDetail as ArticleDetailData } from "@/types/iReport";

interface ArticlePreviewDialogProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  article: ArticleDetailData;
}

export function ArticlePreviewDialog({ isOpen, onClose, article }: ArticlePreviewDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-[90vh] w-[95vw] max-w-7xl overflow-hidden p-0">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle>Xem trước bài viết</DialogTitle>
        </DialogHeader>
        <div className="h-full overflow-y-auto px-0">
          <ArticleDetail article={article} categorySlug={article.category?.slug} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
