"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useAdminUsers } from "@/hooks/admin/useAdminUsers";
import { useAdminPlans } from "@/hooks/admin/useAdminPlans";
import { UserDetailSheet } from "@/components/admin/userDetailSheet";
import { DataTable } from "@/components/admin/dataTable";
import { AdminPageHeader } from "@/components/admin/shared/adminPageHeader";
import { AdminErrorState } from "@/components/admin/shared/adminErrorState";
import { buildUserColumns } from "./_components/userColumns";

export default function AdminUsersPage() {
  const {
    users,
    isLoading,
    error,
    updateRole,
    toggleBlock,
    updatePlan,
    isUpdatingRole,
    isTogglingBlock,
    isUpdatingPlan,
  } = useAdminUsers();
  const { plans } = useAdminPlans();
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  const editingUser = useMemo(
    () => users?.find((user) => user.id === editingUserId) ?? null,
    [users, editingUserId]
  );

  const columns = useMemo(
    () =>
      buildUserColumns({
        onEdit: setEditingUserId,
        onToggleBlock: (id, isBlocked) => toggleBlock({ id, isBlocked }),
      }),
    [toggleBlock]
  );

  if (error) {
    return (
      <AdminErrorState message={`Lỗi tải danh sách người dùng: ${(error as Error).message}`} />
    );
  }

  const pageVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="show" className="space-y-8 pb-12">
      <AdminPageHeader
        title="Người dùng"
        description="Quản lý thành viên, phân quyền, gói truy cập và trạng thái hoạt động."
      />

      <motion.div variants={itemVariants}>
        <Card className="bg-[#000000] border border-[#222] shadow-[4px_4px_0_#222] rounded-none">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-12 text-center text-[#888] text-[13px] font-medium uppercase tracking-widest">Đang tải dữ liệu...</div>
            ) : (
              <div className="p-5">
              <DataTable
                columns={columns}
                data={users || []}
                searchKey="email"
                searchPlaceholder="Tìm người dùng theo email..."
              />
            </div>
          )}
          </CardContent>
        </Card>
      </motion.div>

      <UserDetailSheet
        user={editingUser}
        plans={plans || []}
        isOpen={!!editingUser}
        onClose={() => setEditingUserId(null)}
        onUpdateRole={async (id, role) => updateRole({ id, role })}
        onToggleBlock={async (id, isBlocked) => toggleBlock({ id, isBlocked })}
        onUpdatePlan={async (id, planId) => updatePlan({ id, planId })}
        isUpdatingRole={isUpdatingRole}
        isTogglingBlock={isTogglingBlock}
        isUpdatingPlan={isUpdatingPlan}
      />
    </motion.div>
  );
}
