"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import Link from "next/link";
import { Pencil, Trash2, Eye, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdownMenu";
import { AdminArticle } from "@/hooks/admin/useAdminArticles";
import { StatusBadge, isArticlePublished } from "@/components/admin/shared/statusBadge";
import { SortableColumnHeader } from "@/components/admin/shared/sortableColumnHeader";

interface BuildColumnsOptions {
  onDelete: (slug: string) => void;
}

export function buildArticleColumns({ onDelete }: BuildColumnsOptions): ColumnDef<AdminArticle>[] {
  return [
    {
      accessorKey: "title",
      header: "Tiêu đề",
      cell: ({ row }) => {
        const article = row.original;
        return (
          <div className="flex flex-col gap-1 max-w-[300px]">
            <span className="font-medium truncate" title={article.title}>
              {article.title}
            </span>
            <span className="text-xs text-muted-foreground truncate">{article.slug}</span>
          </div>
        );
      },
    },
    {
      accessorFn: (row) => row.category?.name || "Chưa phân loại",
      id: "category",
      header: ({ column }) => <SortableColumnHeader column={column} label="Chuyên mục" />,
      cell: ({ row }) => (
        <Badge variant="secondary" className="font-normal">
          {row.original.category?.name || "Chưa phân loại"}
        </Badge>
      ),
    },
    {
      accessorFn: (row) => row.author?.name || "Hệ thống",
      id: "author",
      header: ({ column }) => <SortableColumnHeader column={column} label="Tác giả" />,
      cell: ({ row }) => (
        <span className="text-sm">{row.original.author?.name || "Hệ thống"}</span>
      ),
    },
    {
      accessorFn: (row) => (isArticlePublished(row.publishedAt) ? 1 : 0),
      id: "status",
      header: ({ column }) => <SortableColumnHeader column={column} label="Trạng thái" />,
      cell: ({ row }) => (
        <StatusBadge isPublished={isArticlePublished(row.original.publishedAt)} />
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => <SortableColumnHeader column={column} label="Ngày tạo" />,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {format(new Date(row.original.createdAt), "dd/MM/yyyy HH:mm", { locale: vi })}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const article = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Mở menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Hành động</DropdownMenuLabel>
              <DropdownMenuItem asChild disabled={!article.category?.slug}>
                <Link
                  href={
                    article.category?.slug
                      ? `/news/${article.category.slug}/${article.slug}`
                      : "#"
                  }
                  target="_blank"
                  className="cursor-pointer"
                >
                  <Eye className="mr-2 h-4 w-4" /> Xem trực tiếp
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/admin/articles/${article.slug}`} className="cursor-pointer">
                  <Pencil className="mr-2 h-4 w-4" /> Chỉnh sửa
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(article.slug)}
                className="text-red-600 cursor-pointer focus:bg-red-50 focus:text-red-700"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Xóa bài viết
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
