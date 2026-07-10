"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { AdminPlan } from "@/hooks/admin/useAdminPlans";
import { formatCurrency, themeBadgeVariant } from "../_lib/planFormHelpers";

interface PlanTableProps {
  plans: AdminPlan[];
  isLoading: boolean;
  isDeleting: boolean;
  onEdit: (plan: AdminPlan) => void;
  onDelete: (plan: AdminPlan) => void;
}

export function PlanTable({ plans, isLoading, isDeleting, onEdit, onDelete }: PlanTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border-2 border-[#222] bg-[#000000] shadow-[4px_4px_0_#222]">
      <table className="w-full whitespace-nowrap text-left text-sm">
        <thead className="border-b-2 border-[#222] bg-[#0A0A0A] text-[11px] font-black uppercase tracking-widest text-[#ffffff]">
          <tr>
            <th className="px-4 py-3">Goi cuoc</th>
            <th className="px-4 py-3">Theme</th>
            <th className="px-4 py-3 text-[#c084fc]">Gia thang</th>
            <th className="px-4 py-3">Gia 6 thang</th>
            <th className="px-4 py-3">Nhan</th>
            <th className="px-4 py-3">Trang thai</th>
            <th className="px-4 py-3 text-right">Thao tac</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#222]">
          {plans.map((plan) => (
            <tr key={plan.id} className="align-top transition-colors hover:bg-[#111] hover:shadow-[inset_2px_0_0_#c084fc]">
              <td className="min-w-[260px] px-4 py-3">
                <div className="text-[14px] font-bold text-[#ffffff]">{plan.name}</div>
                <div className="text-[12px] uppercase tracking-widest text-[#666]">{plan.slug}</div>
                <div className="mt-1 text-[11px] font-medium text-[#888]">
                  Cap {plan.level} - Thu tu {plan.sortOrder}
                </div>
              </td>
              <td className="px-4 py-3">
                <Badge
                  variant={themeBadgeVariant[plan.theme] ?? "secondary"}
                  className="rounded-none border-[#222] text-[10px] font-bold uppercase tracking-widest"
                >
                  {plan.theme}
                </Badge>
              </td>
              <td className="px-4 py-3 text-[14px] font-black text-[#c084fc]">
                {formatCurrency(plan.monthlyPrice)}
              </td>
              <td className="px-4 py-3 font-medium text-[#ededed]">
                {plan.semiAnnualPrice ? formatCurrency(plan.semiAnnualPrice) : "-"}
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  {plan.badge && (
                    <Badge variant="secondary" className="rounded-none border-[#222] bg-[#222] text-white hover:bg-[#333]">
                      {plan.badge}
                    </Badge>
                  )}
                  {plan.isPopular && (
                    <Badge className="rounded-none bg-[#c084fc] text-[10px] font-black uppercase tracking-widest text-black hover:bg-[#a855f7]">
                      Pho bien
                    </Badge>
                  )}
                  {plan.highlighted && (
                    <Badge className="rounded-none border-2 border-[#c084fc] bg-transparent text-[10px] font-black uppercase tracking-widest text-[#c084fc]">
                      Nhan manh
                    </Badge>
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                <Badge
                  variant={plan.isActive ? "default" : "secondary"}
                  className={`rounded-none border-[#222] text-[10px] font-bold uppercase tracking-widest ${
                    plan.isActive ? "bg-[#c084fc] text-black hover:bg-[#a855f7]" : "bg-[#222] text-[#888]"
                  }`}
                >
                  {plan.isActive ? "Dang bat" : "Dang tat"}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(plan)}
                    className="rounded-none border-[#222] bg-[#111] text-[10px] font-black uppercase tracking-widest text-white shadow-[2px_2px_0_#222] transition-colors hover:border-[#c084fc] hover:bg-[#c084fc] hover:text-black hover:shadow-[2px_2px_0_#c084fc] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                  >
                    Sua
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(plan)}
                    disabled={isDeleting}
                    className="rounded-none border-[#ff0033] bg-[#ff0033]/10 text-[10px] font-black uppercase tracking-widest text-[#ff0033] shadow-[2px_2px_0_#ff0033] transition-colors hover:bg-[#ff0033] hover:text-white active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                  >
                    Xoa
                  </Button>
                </div>
              </td>
            </tr>
          ))}

          {plans.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                Chua co goi cuoc nao
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
