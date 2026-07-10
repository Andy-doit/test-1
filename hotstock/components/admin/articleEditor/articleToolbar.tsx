"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Eye, Save, Send, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface ArticleToolbarProps {
  isPublished: boolean;
  isLoading?: boolean;
  canPreview: boolean;
  onPreview: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  onCancel: () => void;
}

export function ArticleToolbar({
  isPublished,
  isLoading,
  canPreview,
  onPreview,
  onSaveDraft,
  onPublish,
  onCancel,
}: ArticleToolbarProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between">
      <Button variant="outline" onClick={() => router.back()} className="gap-2 rounded-none border-2 border-[#222] bg-[#111] text-[#fff] hover:bg-[#222] font-black uppercase tracking-widest text-[12px] h-10 transition-colors shadow-[4px_4px_0_#222] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]">
        <ChevronLeft size={16} /> Quay lại
      </Button>
      <div className="flex items-center gap-4">
        <Badge
          variant={isPublished ? "default" : "secondary"}
          className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 border-2 border-[#222] rounded-none shadow-[2px_2px_0_#222] ${
            isPublished ? "bg-[#c084fc] text-black" : "bg-[#111] text-[#fff]"
          }`}
        >
          {isPublished ? "PUBLISHED" : "DRAFT"}
        </Badge>
        <Button variant="outline" className="gap-2 rounded-none border-2 border-[#222] bg-[#111] text-[#fff] hover:bg-[#222] font-black uppercase tracking-widest text-[12px] h-10 transition-colors shadow-[4px_4px_0_#222] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]" onClick={onCancel} disabled={isLoading}>
          <X size={16} /> Cancel
        </Button>
        <Button
          variant="outline"
          className="gap-2 rounded-none border-2 border-[#222] bg-[#111] text-[#fff] hover:bg-[#222] font-black uppercase tracking-widest text-[12px] h-10 transition-colors shadow-[4px_4px_0_#222] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
          onClick={onPreview}
          disabled={!canPreview}
        >
          <Eye size={16} /> Preview
        </Button>
        <Button
          variant="outline"
          className="gap-2 rounded-none border-2 border-[#222] bg-[#111] text-[#fff] hover:bg-[#222] font-black uppercase tracking-widest text-[12px] h-10 transition-colors shadow-[4px_4px_0_#222] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
          onClick={onSaveDraft}
          disabled={isLoading}
        >
          <Save size={16} /> Save Draft
        </Button>
        <Button className="gap-2 rounded-none border-2 border-[#222] bg-[#c084fc] text-black hover:bg-[#a855f7] font-black uppercase tracking-widest text-[12px] h-10 transition-colors shadow-[4px_4px_0_#222] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]" onClick={onPublish} disabled={isLoading}>
          <Send size={16} /> Publish
        </Button>
      </div>
    </div>
  );
}
