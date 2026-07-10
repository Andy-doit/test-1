"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";

// System roles are defined in the backend (Prisma enum) and cannot be modified via UI.
// User counts are fetched from the dashboard stats API.
const SYSTEM_ROLES = [
  {
    name: "ADMIN",
    description: "Quyền truy cập đầy đủ vào tất cả các tính năng hệ thống",
    isSystem: true,
    permissions: [
      "Quản lý người dùng",
      "Quản lý nội dung bài viết",
      "Xem phân tích & báo cáo",
      "Quản lý vai trò",
    ],
  },
  {
    name: "EDITOR",
    description: "Chỉ có thể quản lý bài viết và nội dung",
    isSystem: true,
    permissions: [
      "Quản lý nội dung bài viết",
      "Xem phân tích & báo cáo",
    ],
  },
  {
    name: "USER",
    description: "Người dùng tiêu chuẩn với quyền đọc nội dung",
    isSystem: true,
    permissions: [
      "Xem nội dung miễn phí",
      "Xem nội dung theo gói đã đăng ký",
    ],
  },
];

export default function AdminRolesPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div>
        <h2 className="text-[22px] font-semibold tracking-tight text-[#ededed]">Vai trò & Phân quyền</h2>
        <p className="text-[14px] text-[#888] mt-1">
          Các vai trò hệ thống. Quyền hạn được quản lý tập trung trên backend.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {SYSTEM_ROLES.map((role) => (
          <Card key={role.name} className="relative overflow-hidden bg-[#0A0A0A] border-[#1a1a1a] shadow-none">
            {role.isSystem && (
              <div className="absolute top-0 right-0">
                <Badge variant="secondary" className="rounded-none rounded-bl-lg bg-[#111] border-[#222] text-[#888]">
                  Hệ thống
                </Badge>
              </div>
            )}
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-4 h-4 text-violet-500" />
                <CardTitle className="text-base text-[#ededed] font-medium">{role.name}</CardTitle>
              </div>
              <CardDescription className="text-[#666] text-xs leading-normal">
                {role.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="pt-2 space-y-2">
                {role.permissions.map((perm) => (
                  <div key={perm} className="flex items-center gap-2 text-xs text-[#888]">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500 flex-shrink-0" />
                    {perm}
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#444] pt-4 border-t border-[#1a1a1a]">
                Quyền được quản lý tự động bởi hệ thống
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
