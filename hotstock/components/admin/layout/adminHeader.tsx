"use client";

import { AdminBreadcrumb } from "@/components/admin/adminBreadcrumb";

interface AdminHeaderProps {
  username?: string;
  role?: string;
}

export function AdminHeader({ username, role }: AdminHeaderProps) {
  const initials = username ? username.substring(0, 2).toUpperCase() : "AD";

  return (
    <header className="flex h-14 shrink-0 items-center justify-between px-6 z-10 sticky top-0 backdrop-blur-md bg-black/60 border-b border-[#1a1a1a]">
      <div className="flex-1">
        <AdminBreadcrumb />
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[13px] font-medium text-[#ededed]">{username || "Admin"}</span>
            <span className="text-[11px] text-[#888] capitalize">{role || "Quản trị viên"}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#111] border border-[#222] flex items-center justify-center overflow-hidden">
            <span className="text-[12px] font-medium text-[#ededed]">{initials}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
