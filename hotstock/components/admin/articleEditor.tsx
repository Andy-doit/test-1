"use client";

import { useMemo, useState, useEffect } from "react";
import { useForm, Controller, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { AdminArticle } from "@/hooks/admin/useAdminArticles";
import { BlockEditor, Block } from "./editor/blockEditor";
import { ImageUpload } from "./imageUpload";
import { logger } from "@/lib/utils/logger";
import { CategoryPicker } from "./editor/categoryPicker";
import { TagPicker } from "./editor/tagPicker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArticleToolbar } from "./articleEditor/articleToolbar";
import { ArticlePreviewDialog } from "./articleEditor/articlePreviewDialog";
import { getInitialBlocks, normalizeEditorContent } from "./articleEditor/contentNormalizer";
import type { ArticleDetail as ArticleDetailData } from "@/types/iReport";

const articleSchema = z.object({
  title: z.string().min(3, "Tiêu đề quá ngắn"),
  slug: z.string().min(3, "Đường dẫn quá ngắn"),
  description: z.string().min(1, "Vui lòng nhập mô tả ngắn"),
  coverUrl: z.string().optional().transform((val) => (val === "" ? undefined : val)),
  categoryId: z.number({ message: "Vui lòng chọn danh mục" }).min(1, "Vui lòng chọn danh mục"),
  tagIds: z.array(z.number()).default([]),
  readPermission: z.string().default("public"),
});

type ArticleFormValues = z.infer<typeof articleSchema>;

interface ArticleEditorProps {
  initialData?: AdminArticle;
  onSave: (payload: Partial<AdminArticle>) => Promise<void>;
  isLoading?: boolean;
}

const toSlug = (str: string): string =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const READ_PERMISSIONS = [
  { value: "public", label: "Public (Tất cả mọi người)" },
  { value: "member", label: "Member (Thành viên đăng nhập)" },
  { value: "editor", label: "Editor (Biên tập viên)" },
  { value: "admin", label: "Admin (Quản trị viên)" },
] as const;

export function ArticleEditor({ initialData, onSave, isLoading }: ArticleEditorProps) {
  const router = useRouter();
  const [blocks, setBlocks] = useState<Block[]>(() =>
    getInitialBlocks(initialData as unknown as Record<string, unknown>)
  );
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ArticleFormValues>({
    // The schema input is unknown to RHF's Resolver<T> generic — cast through
  // unknown to satisfy the strict signature without `as any`.
  resolver: zodResolver(articleSchema) as unknown as Resolver<ArticleFormValues>,
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      coverUrl: initialData?.coverUrl || "",
      categoryId: initialData?.categoryId,
      tagIds: initialData?.tags?.map((t) => t.id) || [],
      readPermission: initialData?.readPermission || "public",
    },
  });

  useEffect(() => {
    setBlocks(getInitialBlocks(initialData as unknown as Record<string, unknown>));
    reset({
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      coverUrl: initialData?.coverUrl || "",
      categoryId: initialData?.categoryId,
      tagIds: initialData?.tags?.map((t) => t.id) || [],
      readPermission: initialData?.readPermission || "public",
    });
  }, [initialData, reset]);

  const isPublished = !!initialData?.publishedAt;

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setValue("title", newTitle);
    if (!initialData) setValue("slug", toSlug(newTitle));
  };

  const buildContentBlocks = () =>
    blocks
      .map((block) => ({
        id: block.id,
        type: "text" as const,
        content: normalizeEditorContent(block.content),
      }))
      .filter((block) => block.content.trim().length > 0);

  const handleAction = (publish: boolean) =>
    handleSubmit(async (values) => {
      try {
        await onSave({
          title: values.title,
          slug: values.slug,
          description: values.description,
          coverUrl: values.coverUrl,
          contentBlocks: buildContentBlocks(),
          categoryId: values.categoryId,
          tagIds: values.tagIds,
          readPermission: values.readPermission,
          publishedAt: publish ? new Date().toISOString() : null,
        });
      } catch (error) {
        logger.error("[ArticleEditor] Failed to save article:", error);
      }
    })();

  const currentTitle = watch("title");
  const currentSlug = watch("slug");
  const currentDescription = watch("description");
  const currentCoverUrl = watch("coverUrl");
  const currentCategoryId = watch("categoryId");

  const previewArticle = useMemo<ArticleDetailData>(
    () => ({
      id: initialData?.id ?? 0,
      documentId: "admin-preview",
      title: currentTitle?.trim() || "Bản xem trước bài viết",
      description: currentDescription?.trim() || "",
      slug: currentSlug?.trim() || "preview",
      createdAt: initialData?.createdAt ?? new Date().toISOString(),
      updatedAt: initialData?.updatedAt ?? new Date().toISOString(),
      publishedAt: initialData?.publishedAt ?? new Date().toISOString(),
      plans: [],
      category:
        initialData?.category && initialData.categoryId === currentCategoryId
          ? {
              id: initialData.category.id,
              documentId: `category-${initialData.category.id}`,
              name: initialData.category.name,
              slug: initialData.category.slug,
              description: "",
              createdAt: "",
              updatedAt: "",
              publishedAt: "",
            }
          : null,
      tag: initialData?.tags?.[0]
        ? {
            id: initialData.tags[0].id,
            documentId: `tag-${initialData.tags[0].id}`,
            name: initialData.tags[0].name,
            createdAt: "",
            updatedAt: "",
            publishedAt: "",
          }
        : null,
      cover: currentCoverUrl ? { url: currentCoverUrl } : null,
      coverUrl: currentCoverUrl || "",
      blocks: buildContentBlocks(),
      author: initialData?.author
        ? {
            id: initialData.author.id,
            documentId: `author-${initialData.author.id}`,
            name: initialData.author.name,
            createdAt: "",
            updatedAt: "",
            publishedAt: "",
          }
        : null,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [blocks, currentCategoryId, currentCoverUrl, currentDescription, currentSlug, currentTitle, initialData]
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <ArticleToolbar
        isPublished={isPublished}
        isLoading={isLoading}
        canPreview={!!(currentSlug?.trim() || currentTitle?.trim())}
        onPreview={() => setIsPreviewOpen(true)}
        onSaveDraft={() => handleAction(false)}
        onPublish={() => handleAction(true)}
        onCancel={() => router.back()}
      />

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Left column (70%) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="bg-[#000] border-2 border-[#222] shadow-[4px_4px_0_#222] rounded-none">
            <CardContent className="p-6 space-y-6 pt-6">
              <div className="space-y-2">
                <Label className="text-[12px] font-black uppercase tracking-widest text-[#fff]">Tiêu đề bài viết</Label>
                <Input
                  placeholder="Tiêu đề..."
                  className="text-[20px] font-bold h-14 border-2 border-[#222] bg-[#111] rounded-none px-4 focus-visible:ring-0 focus-visible:border-[#c084fc] text-[#fff] shadow-[inset_2px_2px_0_#000]"
                  {...register("title")}
                  onChange={onTitleChange}
                />
                {errors.title && <p className="text-[12px] font-bold text-red-500">{errors.title.message}</p>}
              </div>

              <div className="space-y-2 bg-[#0A0A0A] border-2 border-[#222] p-4 rounded-none">
                <Label className="text-[12px] font-black uppercase tracking-widest text-[#fff]">Đường dẫn (Slug)</Label>
                <Input {...register("slug")} className="h-10 border-2 border-[#222] bg-[#111] rounded-none focus-visible:ring-0 focus-visible:border-[#c084fc] text-[#fff]" />
                {errors.slug && <p className="text-[12px] font-bold text-red-500">{errors.slug.message}</p>}
                <p className="text-[11px] font-medium text-[#888] pt-1">
                  URL Preview:{" "}
                  <span className="text-[#c084fc] font-mono font-bold">
                    https://yoursite.com/articles/{currentSlug}
                  </span>
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-[12px] font-black uppercase tracking-widest text-[#fff]">Mô tả (Description)</Label>
                <Textarea
                  placeholder="Mô tả ngắn hiển thị ở trang chủ..."
                  {...register("description")}
                  className="resize-none border-2 border-[#222] bg-[#111] rounded-none focus-visible:ring-0 focus-visible:border-[#c084fc] text-[#fff] min-h-[100px]"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[12px] font-black uppercase tracking-widest text-[#fff]">Ảnh bìa (Cover Image)</Label>
                <Controller
                  control={control}
                  name="coverUrl"
                  render={({ field }) => (
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      onRemove={() => field.onChange("")}
                    />
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#000] border-2 border-[#222] shadow-[4px_4px_0_#222] rounded-none">
            <CardHeader className="border-b-2 border-[#222] pb-4">
              <CardTitle className="text-[14px] text-[#ffffff] font-black uppercase tracking-widest">Nội dung (Blocks)</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <BlockEditor blocks={blocks} onChange={setBlocks} />
            </CardContent>
          </Card>
        </div>

        {/* Right sidebar (30%) */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="bg-[#0A0A0A] border-2 border-[#222] shadow-[4px_4px_0_#222] rounded-none">
            <CardHeader className="pb-4 border-b-2 border-[#222]">
              <CardTitle className="text-[14px] text-[#ffffff] font-black uppercase tracking-widest">Tổ chức</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-5 pt-5">
              <div className="space-y-2">
                <Label className="text-[12px] font-black uppercase tracking-widest text-[#fff]">Danh mục (Category)</Label>
                <Controller
                  control={control}
                  name="categoryId"
                  render={({ field }) => (
                    <CategoryPicker value={field.value} onChange={field.onChange} />
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[12px] font-black uppercase tracking-widest text-[#fff]">Thẻ (Tags)</Label>
                <Controller
                  control={control}
                  name="tagIds"
                  render={({ field }) => (
                    <TagPicker selectedIds={field.value} onChange={field.onChange} />
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0A0A0A] border-2 border-[#222] shadow-[4px_4px_0_#222] rounded-none">
            <CardHeader className="pb-4 border-b-2 border-[#222]">
              <CardTitle className="text-[14px] text-[#ffffff] font-black uppercase tracking-widest">Quyền truy cập</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-5">
              <div className="space-y-2">
                <Label className="text-[12px] font-black uppercase tracking-widest text-[#fff]">Read Permission</Label>
                <Controller
                  control={control}
                  name="readPermission"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {READ_PERMISSIONS.map(({ value, label }) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ArticlePreviewDialog
        isOpen={isPreviewOpen}
        onClose={setIsPreviewOpen}
        article={previewArticle}
      />
    </div>
  );
}
