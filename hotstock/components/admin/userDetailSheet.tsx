"use client";

import { AdminUser } from "@/hooks/admin/useAdminUsers";
import { AdminPlan } from "@/hooks/admin/useAdminPlans";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface UserDetailSheetProps {
  user: AdminUser | null;
  plans: AdminPlan[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateRole: (id: number, role: string) => Promise<void>;
  onToggleBlock: (id: number, isBlocked: boolean) => Promise<void>;
  onUpdatePlan: (id: number, planId: number) => Promise<void>;
  isUpdatingRole?: boolean;
  isTogglingBlock?: boolean;
  isUpdatingPlan?: boolean;
}

export function UserDetailSheet({
  user,
  plans,
  isOpen,
  onClose,
  onUpdateRole,
  onToggleBlock,
  onUpdatePlan,
  isUpdatingRole,
  isTogglingBlock,
  isUpdatingPlan
}: UserDetailSheetProps) {
  if (!user) return null;

  // role might be "admin", "user", "editor"
  const userRole = user.role?.toLowerCase() || "user";
  // Convert isActive to isBlocked logic. 
  // If user.isActive is true, then blocked = false
  // Because backend hook has toggleBlock(id, isBlocked).
  // Assuming if isActive is false, they are blocked.
  const isBlocked = user.isActive === false;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-xl w-full overflow-y-auto bg-[#000000] border-l-4 border-[#222] shadow-[-12px_0_0_#222] flex flex-col h-full p-8">
        <SheetHeader className="mb-8 border-b-4 border-[#222] pb-6">
          <SheetTitle className="text-[24px] font-black uppercase tracking-widest text-[#ffffff]">Chi tiết tài khoản</SheetTitle>
          <SheetDescription className="text-[#888] font-medium text-[14px] mt-2">
            Quản lý quyền và trạng thái của người dùng.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-10 flex-1 overflow-y-auto pr-4">
          {/* Info Section */}
          <div className="space-y-6">
            <div>
              <Label className="text-[#888] text-[12px] font-black uppercase tracking-widest">Tên đăng nhập</Label>
              <p className="font-bold text-[18px] mt-1 text-[#fff]">{user.username}</p>
            </div>
            <div>
              <Label className="text-[#888] text-[12px] font-black uppercase tracking-widest">Họ và tên</Label>
              <p className="font-bold text-[18px] mt-1 text-[#fff]">{user.fullName || "—"}</p>
            </div>
            <div>
              <Label className="text-[#888] text-[12px] font-black uppercase tracking-widest">Email</Label>
              <p className="font-bold text-[18px] mt-1 text-[#fff]">{user.email}</p>
            </div>
            <div>
              <Label className="text-[#888] text-[12px] font-black uppercase tracking-widest">Số điện thoại</Label>
              <p className="font-bold text-[18px] mt-1 text-[#fff]">{user.phoneNumber || "—"}</p>
            </div>
            <div>
              <Label className="text-[#888] text-[12px] font-black uppercase tracking-widest">Ngày tham gia</Label>
              <p className="font-bold text-[18px] mt-1 text-[#c084fc]">
                {format(new Date(user.createdAt), "dd/MM/yyyy HH:mm", { locale: vi })}
              </p>
            </div>
          </div>

          <div className="border-t-4 border-[#222] pt-8 space-y-8">
            <h4 className="font-black text-[#ffffff] text-[18px] uppercase tracking-widest">Phân quyền & Gói</h4>

            <div className="space-y-3">
              <Label className="text-[#fff] text-[12px] font-black uppercase tracking-widest">Vai trò (Role)</Label>
              <Select
                defaultValue={userRole}
                onValueChange={(val) => onUpdateRole(user.id, val)}
                disabled={isUpdatingRole}
              >
                <SelectTrigger className="h-14 bg-[#111] border-2 border-[#222] text-[#fff] text-[16px] font-bold rounded-none shadow-[inset_2px_2px_0_#000] focus:ring-0 focus:border-[#c084fc]">
                  <SelectValue placeholder="Chọn quyền" />
                </SelectTrigger>
                <SelectContent className="bg-[#000] border-2 border-[#222] rounded-none shadow-[4px_4px_0_#222] text-[#fff]">
                  <SelectItem value="user" className="focus:bg-[#c084fc] focus:text-black font-bold">Người dùng (User)</SelectItem>
                  <SelectItem value="editor" className="focus:bg-[#c084fc] focus:text-black font-bold">Biên tập viên (Editor)</SelectItem>
                  <SelectItem value="admin" className="focus:bg-[#c084fc] focus:text-black font-bold">Quản trị viên (Admin)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-[#fff] text-[12px] font-black uppercase tracking-widest">Gói thành viên</Label>
                <p className="text-[12px] text-[#888] font-medium">
                  Gán quyền truy cập nội dung theo plan cho tài khoản này.
                </p>
              </div>

              <div className="border-2 border-[#222] bg-[#111] p-6 rounded-none shadow-[4px_4px_0_#222]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[12px] uppercase font-black tracking-widest text-[#888]">Gói hiện tại</p>
                    <p className="font-black text-[#c084fc] text-[18px] mt-1">
                      {user.plan ? `${user.plan.name} (Level ${user.plan.level})` : "Chưa có gói"}
                    </p>
                  </div>
                  {user.plan ? (
                    <Badge variant="secondary" className="px-3 py-1 text-[12px] uppercase tracking-widest font-black rounded-none border-2 border-[#222] bg-[#c084fc] text-black shadow-[2px_2px_0_#222]">{user.plan.slug}</Badge>
                  ) : (
                    <Badge variant="outline" className="px-3 py-1 text-[12px] uppercase tracking-widest font-black rounded-none border-2 border-[#222] text-[#888]">Free</Badge>
                  )}
                </div>
              </div>

              <Select
                value={user.plan?.id ? String(user.plan.id) : undefined}
                onValueChange={(val) => onUpdatePlan(user.id, Number(val))}
                disabled={isUpdatingPlan}
              >
                <SelectTrigger className="h-14 mt-4 bg-[#111] border-2 border-[#222] text-[#fff] text-[16px] font-bold rounded-none shadow-[inset_2px_2px_0_#000] focus:ring-0 focus:border-[#c084fc]">
                  <SelectValue placeholder="Chọn gói để nâng cấp / thay đổi" />
                </SelectTrigger>
                <SelectContent className="bg-[#000] border-2 border-[#222] rounded-none shadow-[4px_4px_0_#222] text-[#fff]">
                  {plans.map((plan) => (
                    <SelectItem key={plan.id} value={String(plan.id)} className="focus:bg-[#c084fc] focus:text-black font-bold">
                      {plan.name} - Level {plan.level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between bg-[#0A0A0A] border-2 border-[#222] p-6 rounded-none shadow-[4px_4px_0_#222]">
              <div className="space-y-1">
                <Label className="text-[#fff] text-[14px] font-black uppercase tracking-widest">Khóa tài khoản</Label>
                <p className="text-[12px] font-medium text-[#888]">Chặn đăng nhập và sử dụng hệ thống</p>
              </div>
              <Switch
                checked={isBlocked}
                onCheckedChange={(checked) => onToggleBlock(user.id, checked)}
                disabled={isTogglingBlock}
                className="data-[state=checked]:bg-[#ff0033] data-[state=unchecked]:bg-[#444] border-2 border-[#222] scale-125"
              />
            </div>
          </div>
          
          <div className="pt-8 border-t-4 border-[#222] mt-8 flex justify-end">
             <Button className="h-12 px-8 bg-transparent hover:bg-[#222] text-[#fff] rounded-none font-black tracking-widest uppercase border-2 border-[#222] transition-colors" variant="outline" onClick={onClose}>
                Đóng
             </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
