"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import { UploadCloud, Loader2 } from "lucide-react";
import { uploadsService } from "@/lib/services/uploadsService";
import { toast } from "sonner";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  className?: string;
}

export function ImageUpload({ value, onChange, onRemove, className = "" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file hình ảnh hợp lệ (JPG, PNG, GIF, WebP)");
      return;
    }
    // FIX: Corrected 2554 -> 1024 (1KB = 1024 bytes, not 2554)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước file không được vượt quá 5MB");
      return;
    }

    try {
      setIsUploading(true);
      const url = await uploadsService.uploadFile(file);
      onChange(url);
      toast.success("Tải ảnh lên thành công!");
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        toast.error("Lỗi khi tải ảnh: " + message);
      } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await uploadFile(file);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-border bg-muted/30 aspect-video flex items-center justify-center">
          <Image 
            src={value} 
            alt="Uploaded image" 
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button 
              type="button" 
              variant="secondary" 
              size="sm" 
              onClick={() => fileInputRef.current?.click()}
            >
              Đổi ảnh
            </Button>
            {onRemove && (
              <Button 
                type="button" 
                variant="destructive" 
                size="sm" 
                onClick={onRemove}
              >
                Xóa
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-4 transition-colors cursor-pointer aspect-video
            ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30"}
            ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isUploading ? (
            <div className="flex flex-col items-center text-primary">
              <Loader2 className="w-10 h-10 animate-spin mb-4" />
              <p className="font-medium">Đang tải ảnh lên...</p>
            </div>
          ) : (
            <>
              <div className="p-4 rounded-full bg-primary/10 text-primary">
                <UploadCloud className="w-8 h-8" />
              </div>
              <div className="text-center space-y-1">
                <p className="font-medium text-foreground">
                  Kéo thả ảnh vào đây hoặc click để chọn file
                </p>
                <p className="text-sm text-muted-foreground">
                  Hỗ trợ JPG, PNG, GIF, WebP (Tối đa 5MB)
                </p>
              </div>
            </>
          )}
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg, image/png, image/gif, image/webp"
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
}
