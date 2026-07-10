"use client";

import React from "react";
import dynamic from "next/dynamic";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Plus, GripVertical, Trash2 } from "lucide-react";
const TipTapEditor = dynamic(() => import('./tipTapEditor').then(mod => mod.TipTapEditor), {
  ssr: false,
  loading: () => <div className="p-4 bg-[#111] border border-[#222] min-h-[150px] animate-pulse rounded-md" />
});
export type Block = {
  id: string;
  type: "text";
  content: string | Record<string, unknown>;
};

interface BlockEditorProps {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
}

interface SortableBlockItemProps {
  block: Block;
  onChange: (content: string) => void;
  onRemove: () => void;
}

function SortableBlockItem({ block, onChange, onRemove }: SortableBlockItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex gap-2 group relative bg-[#000000] border-2 border-[#222] p-2 shadow-[4px_4px_0_#222] hover:shadow-[4px_4px_0_#c084fc] hover:border-[#c084fc] transition-all">
      <div
        className="flex items-center justify-center cursor-grab active:cursor-grabbing px-1 text-[#888] hover:text-[#c084fc] transition-colors"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={20} />
      </div>
      
      <div className="flex-1 min-w-0">
        <TipTapEditor content={block.content} onChange={onChange} />
      </div>
      
      <div className="flex items-start">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="text-[#888] hover:text-[#ff0033] hover:bg-[#ff0033]/10 transition-colors rounded-none"
        >
          <Trash2 size={18} />
        </Button>
      </div>
    </div>
  );
}

export function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    if (active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id);
      const newIndex = blocks.findIndex((b) => b.id === over.id);
      onChange(arrayMove(blocks, oldIndex, newIndex));
    }
  };

  const handleAddBlock = () => {
    onChange([
      ...blocks,
      {
        id: Math.random().toString(36).substring(2, 11),
        type: "text",
        content: "",
      },
    ]);
  };

  const updateBlock = (id: string, content: string) => {
    onChange(
      blocks.map((b) => (b.id === id ? { ...b, content } : b))
    );
  };

  const removeBlock = (id: string) => {
    onChange(blocks.filter((b) => b.id !== id));
  };

  return (
    <div className="space-y-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={blocks.map((b) => b.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {blocks.map((block) => (
              <SortableBlockItem
                key={block.id}
                block={block}
                onChange={(content) => updateBlock(block.id, content)}
                onRemove={() => removeBlock(block.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      
      {blocks.length === 0 && (
        <div className="text-center py-8 font-bold uppercase tracking-widest text-[12px] text-[#888] border-2 border-dashed border-[#333] bg-[#0A0A0A]">
          Chưa có nội dung nào. Nhấn nút bên dưới để thêm nội dung.
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        onClick={handleAddBlock}
        className="w-full border-2 border-dashed border-[#222] bg-[#111] hover:bg-[#c084fc] text-[#ffffff] hover:text-[#000000] hover:border-[#c084fc] font-black uppercase tracking-widest text-[12px] h-12 transition-colors rounded-none shadow-[4px_4px_0_#222] hover:shadow-[4px_4px_0_#c084fc] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
      >
        <Plus className="mr-2 h-5 w-5" /> Thêm block nội dung
      </Button>
    </div>
  );
}
