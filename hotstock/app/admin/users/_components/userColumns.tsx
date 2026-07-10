"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { MoreHorizontal, ShieldAlert, UserCog } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdownMenu";
import { AdminUser } from "@/hooks/admin/useAdminUsers";
import { RoleBadge } from "@/components/admin/shared/roleBadge";

interface BuildColumnsOptions {
  onEdit: (userId: number) => void;
  onToggleBlock: (id: number, isBlocked: boolean) => void;
}

export function buildUserColumns({ onEdit, onToggleBlock }: BuildColumnsOptions): ColumnDef<AdminUser>[] {
  return [
    {
      accessorKey: "username",
      header: "Tên đăng nhập",
      cell: ({ row }) => (
        <span className="font-medium text-foreground">{row.original.username}</span>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.email}</span>
      ),
    },
    {
      accessorKey: "role",
      header: "Quyền (Role)",
      cell: ({ row }) => <RoleBadge role={row.original.role} />,
    },
    {
      accessorKey: "isActive",
      header: "Trạng thái",
      cell: ({ row }) => {
        const isActive = row.original.isActive;
        return isActive ? (
          <Badge className="text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20 rounded px-1.5 py-0.5">
            Đang hoạt động
          </Badge>
        ) : (
          <Badge className="text-[11px] font-semibold bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20 rounded px-1.5 py-0.5">
            Đã khóa
          </Badge>
        );
      },
    },
    {
      id: "plan",
      header: "Gói thành viên",
      cell: ({ row }) => {
        const plan = row.original.plan;
        return plan ? (
          <div className="flex flex-col">
            <span className="font-semibold text-foreground text-sm">{plan.name}</span>
            <span className="text-[11px] text-muted-foreground mt-0.5">
              {plan.slug} • Level {plan.level}
            </span>
          </div>
        ) : (
          <Badge className="text-[11px] font-semibold border-white/10 bg-white/5 text-muted-foreground rounded px-1.5 py-0.5">
            Free
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Ngày tham gia",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground font-medium">
          {format(new Date(row.original.createdAt), "dd/MM/yyyy", { locale: vi })}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;
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
              <DropdownMenuItem onClick={() => onEdit(user.id)} className="cursor-pointer">
                <UserCog className="mr-2 h-4 w-4" /> Chi tiết & Phân quyền
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onToggleBlock(user.id, user.isActive)}
                className={
                  user.isActive
                    ? "text-red-600 focus:text-red-600 cursor-pointer"
                    : "text-green-600 focus:text-green-600 cursor-pointer"
                }
              >
                <ShieldAlert className="mr-2 h-4 w-4" />
                {user.isActive ? "Khóa tài khoản" : "Mở khóa tài khoản"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
