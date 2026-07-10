"use client";

import { useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { X, Plus, ChevronDown } from "lucide-react";
import { useAdminTags } from "@/hooks/admin/useAdminTags";
import { logger } from "@/lib/utils/logger";

interface TagPickerProps {
  selectedIds: number[];
  onChange: (ids: number[]) => void;
}

function toSlug(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function TagPicker({ selectedIds, onChange }: TagPickerProps) {
  const { tags, createTag } = useAdminTags();
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedTags = tags.filter((t) => selectedIds.includes(t.id));
  const availableTags = tags.filter(
    (t) => !selectedIds.includes(t.id) && t.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleSelect = (id: number) => {
    onChange([...selectedIds, id]);
    setInputValue("");
  };

  const handleRemove = (id: number) => {
    onChange(selectedIds.filter((t) => t !== id));
  };

  const handleCreate = async () => {
    if (!inputValue.trim()) return;
    try {
      const slug = toSlug(inputValue);
      const newTag = await createTag.mutateAsync({ name: inputValue, slug });
      onChange([...selectedIds, newTag.id]);
      setInputValue("");
    } catch (error) {
      logger.error("[TagPicker] Failed to create tag:", error);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <div
        className={`flex items-center justify-between min-h-12 w-full rounded-none border-2 px-3 py-2 text-[12px] font-medium transition-colors cursor-pointer shadow-[inset_2px_2px_0_#000] hover:border-[#c084fc] ${
          isOpen ? "outline-none border-[#c084fc] bg-[#111]" : "border-[#222] bg-[#111]"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap items-center gap-2">
          {selectedTags.length === 0 ? (
            <span className="text-[#666] font-bold uppercase tracking-widest text-[10px]">Chọn thẻ (Tag)...</span>
          ) : (
            selectedTags.map((tag) => (
              <Badge key={tag.id} variant="secondary" className="gap-1 px-2 py-1 text-[10px] font-black uppercase tracking-widest bg-[#c084fc] text-black rounded-none border-2 border-[#222] shadow-[2px_2px_0_#222] hover:bg-[#a855f7] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                {tag.name}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(tag.id);
                  }}
                  className="ml-1 hover:bg-[#222] hover:text-[#fff] rounded-full p-0.5 transition-colors cursor-pointer"
                >
                  <X size={12} />
                </button>
              </Badge>
            ))
          )}
        </div>
        <ChevronDown size={16} className={`text-[#888] shrink-0 ml-2 transition-transform ${isOpen ? "rotate-180 text-[#c084fc]" : ""}`} />
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-[#000] border-2 border-[#222] rounded-none shadow-[4px_4px_0_#222] flex flex-col">
          <div className="p-2 border-b-2 border-[#222] bg-[#0A0A0A]">
            <input
              className="w-full bg-[#111] border-2 border-[#222] px-3 py-2 text-[#fff] font-medium text-[12px] outline-none focus:border-[#c084fc] rounded-none"
              placeholder="Tìm hoặc tạo thẻ mới..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (availableTags.length > 0) {
                    handleSelect(availableTags[0].id);
                  } else {
                    handleCreate();
                  }
                }
              }}
              autoFocus
            />
          </div>
          <div className="max-h-[200px] overflow-auto">
            {availableTags.map((tag) => (
              <div
                key={tag.id}
                className="px-4 py-3 hover:bg-[#c084fc] hover:text-black text-[#fff] font-medium text-[12px] transition-colors cursor-pointer border-b border-[#222] last:border-0"
                onClick={() => handleSelect(tag.id)}
              >
                {tag.name}
              </div>
            ))}
            {availableTags.length === 0 && inputValue && (
              <div
                className="px-4 py-3 hover:bg-[#c084fc] hover:text-black text-[#c084fc] font-bold text-[12px] transition-colors cursor-pointer flex items-center gap-2 border-b border-[#222] last:border-0"
                onClick={handleCreate}
              >
                <Plus size={16} /> Tạo thẻ mới &quot;{inputValue}&quot;
              </div>
            )}
            {availableTags.length === 0 && !inputValue && (
              <div className="px-4 py-3 text-[#666] italic text-[12px]">
                Không còn thẻ nào để chọn
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
