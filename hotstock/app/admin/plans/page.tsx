"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  useAdminPlans,
  type AdminPlan,
} from "@/hooks/admin/useAdminPlans";
import { AdminPageHeader } from "@/components/admin/shared/adminPageHeader";
import { AdminErrorState } from "@/components/admin/shared/adminErrorState";
import { PlanFormDialog } from "./_components/planFormDialog";
import { PlanTable } from "./_components/planTable";
import {
  buildPayload,
  buildUpdatePayload,
  defaultFormState,
  toFormState,
  type PlanFormState,
} from "./_lib/planFormHelpers";

export default function AdminPlansPage() {
  const {
    plans,
    isLoading,
    error,
    createPlan,
    updatePlan,
    deletePlan,
    isCreating,
    isUpdating,
    isDeleting,
  } = useAdminPlans();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<AdminPlan | null>(null);
  const [form, setForm] = useState<PlanFormState>(defaultFormState);

  const sortedPlans = useMemo(
    () => [...(plans ?? [])].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    [plans]
  );

  const isSubmitting = isCreating || isUpdating;

  const openCreateDialog = () => {
    setEditingPlan(null);
    setForm(defaultFormState);
    setIsDialogOpen(true);
  };

  const openEditDialog = (plan: AdminPlan) => {
    setEditingPlan(plan);
    setForm(toFormState(plan));
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setEditingPlan(null);
    setForm(defaultFormState);
    setIsDialogOpen(false);
  };

  const handleFormChange = (updates: Partial<PlanFormState>) => {
    setForm((prev) => ({ ...prev, ...updates }));
  };

  const handleSubmit = async () => {
    const payload = buildPayload(form);
    if (!payload.name || !payload.slug || !payload.monthlyPrice || payload.features.length === 0) return;

    if (editingPlan) {
      await updatePlan({ slug: editingPlan.slug, payload: buildUpdatePayload(form) });
    } else {
      await createPlan(payload);
    }

    closeDialog();
  };

  const handleDelete = async (plan: AdminPlan) => {
    if (!window.confirm(`Xóa gói "${plan.name}" (${plan.slug})?`)) return;
    await deletePlan(plan.slug);
  };

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
        title="Quản lý gói cước hội viên"
        description="Admin có thể nhập đầy đủ thông tin hiển thị trên trang membership và cấu hình mỗi plan được xem phần nào trong danh mục Premium."
        action={
          <Button onClick={openCreateDialog} className="border-[#222] hover:border-[#c084fc] bg-[#c084fc] hover:bg-[#a855f7] text-black font-black uppercase tracking-widest text-[11px] h-9 transition-colors rounded-none shadow-[4px_4px_0_#222] hover:shadow-[4px_4px_0_#a855f7] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none">
            Tạo gói cước
          </Button>
        }
      />

      <PlanFormDialog
        isOpen={isDialogOpen}
        editingPlan={editingPlan}
        form={form}
        isSubmitting={isSubmitting}
        onFormChange={handleFormChange}
        onSubmit={handleSubmit}
        onClose={closeDialog}
      />

      <motion.div variants={itemVariants}>
        <Card className="bg-[#000000] border border-[#222] shadow-[4px_4px_0_#222] rounded-none">
          <CardHeader className="border-b border-[#222] pb-4">
            <CardTitle className="text-white text-[14px] font-bold uppercase tracking-widest">Danh sách gói cước</CardTitle>
            <CardDescription className="text-[#888] font-medium text-[12px] mt-1">
              Mỗi gói hiển thị nhanh giá bán, trạng thái và số lượng khối dữ liệu được phép xem.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5">
          {error ? (
            <AdminErrorState message={`Không thể tải danh sách gói cước: ${(error as Error).message}`} />
          ) : (
            <PlanTable
              plans={sortedPlans}
              isLoading={isLoading}
              isDeleting={isDeleting}
              onEdit={openEditDialog}
              onDelete={handleDelete}
            />
          )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
