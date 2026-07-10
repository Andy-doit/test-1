import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useCreateCategory, useUpdateCategory } from "@/hooks/admin/useAdminCategories";
import { Loader2 } from "lucide-react";
import { logger } from "@/lib/utils/logger";

interface CategoryFormData {
  name: string;
  slug: string;
  isVisibleOnUI?: boolean;
}

interface CategoryFormSheetProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: CategoryFormData | null;
}

export default function CategoryFormSheet({ isOpen, onClose, initialData }: CategoryFormSheetProps) {
  return (
    <CategoryFormSheetContent
      key={`${isOpen ? "open" : "closed"}-${initialData?.slug ?? "new"}`}
      isOpen={isOpen}
      onClose={onClose}
      initialData={initialData}
    />
  );
}

function CategoryFormSheetContent({ isOpen, onClose, initialData }: CategoryFormSheetProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [isVisibleOnUI, setIsVisibleOnUI] = useState(initialData?.isVisibleOnUI ?? true);

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();

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
        await updateMutation.mutateAsync({ originalSlug: initialData.slug, name, slug, isVisibleOnUI });
      } else {
        await createMutation.mutateAsync({ name, slug, isVisibleOnUI });
      }
      onClose();
    } catch (error) {
      logger.error("[CategoryFormSheet] Failed to save category:", error);
      alert("Đã có lỗi xảy ra. Vui lòng kiểm tra lại slug có thể bị trùng.");
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-xl w-full bg-[#000000] border-l-4 border-[#222] shadow-[-12px_0_0_#222] flex flex-col h-full p-8">
        <SheetHeader className="mb-8 border-b-4 border-[#222] pb-6">
          <SheetTitle className="text-[24px] font-black uppercase tracking-widest text-[#ffffff]">
            {initialData ? "Sửa Danh mục" : "Thêm Danh mục mới"}
          </SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <div className="space-y-8 flex-1 overflow-y-auto pr-4">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-[12px] font-black uppercase tracking-widest text-[#fff]">Tên danh mục</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ví dụ: Kiến thức đầu tư"
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
                placeholder="kien-thuc-dau-tu"
                required
                className="h-14 border-2 border-[#222] bg-[#111] rounded-none focus-visible:ring-0 focus-visible:border-[#c084fc] text-[#fff] text-[16px] font-bold shadow-[inset_2px_2px_0_#000]"
              />
            </div>

            <div className="flex items-center justify-between bg-[#0A0A0A] border-2 border-[#222] p-6 rounded-none shadow-[4px_4px_0_#222]">
              <div className="space-y-1">
                <Label htmlFor="isVisibleOnUI" className="text-[14px] font-black uppercase tracking-widest text-[#fff]">Hiển thị trên trang chủ</Label>
                <p className="text-[12px] font-medium text-[#888]">
                  Bật để danh mục này hiện thành khối riêng trên giao diện trang tin tức.
                </p>
              </div>
              <Switch
                id="isVisibleOnUI"
                checked={isVisibleOnUI}
                onCheckedChange={setIsVisibleOnUI}
                className="data-[state=checked]:bg-[#c084fc] data-[state=unchecked]:bg-[#444] border-2 border-[#222] scale-125"
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
