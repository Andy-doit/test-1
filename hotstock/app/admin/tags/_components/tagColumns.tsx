import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { Tag } from "@/hooks/admin/useAdminTags";

interface TagColumnsProps {
  onEdit: (tag: Tag) => void;
  onDelete: (slug: string) => void;
}

export const getTagColumns = ({
  onEdit,
  onDelete,
}: TagColumnsProps): ColumnDef<Tag>[] => [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="w-[50px]">{row.original.id}</div>,
  },
  {
    accessorKey: "name",
    header: "Tên thẻ",
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
