import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminTags, Tag } from "@/hooks/admin/useAdminTags";
import { Loader2 } from "lucide-react";
import { logger } from "@/lib/utils/logger";

interface TagFormSheetProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Tag | null;
}

export default function TagFormSheet({ isOpen, onClose, initialData }: TagFormSheetProps) {
  return (
    <TagFormSheetContent
      key={`${isOpen ? "open" : "closed"}-${initialData?.slug ?? "new"}`}
      isOpen={isOpen}
      onClose={onClose}
      initialData={initialData}
    />
  );
}

function TagFormSheetContent({ isOpen, onClose, initialData }: TagFormSheetProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  
  const { createTag, updateTag } = useAdminTags();

  // Auto generate slug from name
  const handleNameChange = (val: string) => {
    setName(val);
    if (!initialData) {
      setSlug(
        val
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[đĐ]/g, "d")
          .replace(/[^a-z0-9 -]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;

    try {
      if (initialData) {
        await updateTag.mutateAsync({ slug: initialData.slug, data: { name, slug } });
      } else {
        await createTag.mutateAsync({ name, slug });
      }
      onClose();
    } catch (error) {
      logger.error("[TagFormSheet] Failed to save tag:", error);
      alert("Đã có lỗi xảy ra. Vui lòng kiểm tra lại slug có thể bị trùng.");
    }
  };

  const isPending = createTag.isPending || updateTag.isPending;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-xl w-full bg-[#000000] border-l-4 border-[#222] shadow-[-12px_0_0_#222] flex flex-col h-full p-8">
        <SheetHeader className="mb-8 border-b-4 border-[#222] pb-6">
          <SheetTitle className="text-[24px] font-black uppercase tracking-widest text-[#ffffff]">
            {initialData ? "Sửa Thẻ (Tag)" : "Thêm Thẻ mới"}
          </SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <div className="space-y-8 flex-1 overflow-y-auto pr-4">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-[12px] font-black uppercase tracking-widest text-[#fff]">Tên thẻ</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ví dụ: Đầu tư giá trị"
                required
                className="h-14 border-2 border-[#222] bg-[#111] rounded-none focus-visible:ring-0 focus-visible:border-[#c084fc] text-[#fff] text-[16px] font-bold shadow-[inset_2px_2px_0_#000]"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="slug" className="text-[12px] font-black uppercase tracking-widest text-[#fff]">Đường dẫn (Slug)</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="dau-tu-gia-tri"
                required
                className="h-14 border-2 border-[#222] bg-[#111] rounded-none focus-visible:ring-0 focus-visible:border-[#c084fc] text-[#fff] text-[16px] font-bold shadow-[inset_2px_2px_0_#000]"
              />
            </div>
          </div>

          <div className="pt-8 border-t-4 border-[#222] mt-auto flex justify-end gap-4">
            <Button type="button" onClick={onClose} className="h-12 px-8 bg-transparent hover:bg-[#222] text-[#fff] rounded-none font-black tracking-widest uppercase border-2 border-[#222] transition-colors">
              Hủy
            </Button>
            <Button type="submit" disabled={isPending} className="h-12 px-8 bg-[#c084fc] hover:bg-[#a855f7] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none text-[#000] rounded-none font-black tracking-widest uppercase border-2 border-[#222] shadow-[4px_4px_0_#222] transition-all">
              {isPending && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
              {initialData ? "Cập nhật" : "Tạo mới"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
