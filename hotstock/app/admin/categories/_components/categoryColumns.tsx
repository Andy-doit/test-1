import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

import { Category } from "@/hooks/admin/useAdminCategories";

interface CategoryColumnsProps {
  onEdit: (category: Category) => void;
  onDelete: (slug: string) => void;
}

export const getCategoryColumns = ({
  onEdit,
  onDelete,
}: CategoryColumnsProps): ColumnDef<Category>[] => [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="w-[50px]">{row.original.id}</div>,
  },
  {
    accessorKey: "name",
    header: "Tên danh mục",
    cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
  },
  {
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => <div className="text-muted-foreground">{row.original.slug}</div>,
  },
  {
    accessorKey: "_count",
    header: "Số bài viết",
    cell: ({ row }) => (
      <Badge variant="secondary">
        {row.original._count?.articles || 0} bài
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Ngày tạo",
    cell: ({ row }) => (
      <div>{format(new Date(row.original.createdAt), "dd/MM/yyyy", { locale: vi })}</div>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
            <Edit2 className="w-4 h-4 text-blue-500" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(item.slug)}>
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      );
    },
  },
];
