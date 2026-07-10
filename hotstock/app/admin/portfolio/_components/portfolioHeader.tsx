import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { TIER_LABELS, TIER_DESCRIPTIONS, type PortfolioTier } from "@/lib/constants/portfolio";
import type { EditablePortfolioForm } from "../_lib/portfolioHelpers";

interface PortfolioHeaderProps {
  activeTier: PortfolioTier;
  handleTierChange: (tier: PortfolioTier) => void;
  formsByTier: Record<PortfolioTier, EditablePortfolioForm>;
  form: EditablePortfolioForm;
  updateCurrentForm: (updater: (current: EditablePortfolioForm) => EditablePortfolioForm) => void;
  totalMarketValue: number;
}

export function PortfolioHeader({
  activeTier,
  handleTierChange,
  formsByTier,
  form,
  updateCurrentForm,
  totalMarketValue,
}: PortfolioHeaderProps) {
  return (
    <Card className="p-5 space-y-5 bg-[#0A0A0A] border-[#1a1a1a] shadow-none">
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3">
          <Label className="text-[#888] text-[13px]">Chọn gói danh mục cần chỉnh</Label>
          <div className="flex flex-wrap gap-2">
            {(["community", "titan", "gold", "premium"] as PortfolioTier[]).map((tier) => {
              const isActive = activeTier === tier;
              const hasData = formsByTier[tier].portfolioId !== null;
              return (
                <button
                  key={tier}
                  type="button"
                  onClick={() => handleTierChange(tier)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? "border-violet-500 bg-violet-500/15 text-violet-200"
                      : "border-border bg-background text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {TIER_LABELS[tier]}
                  {hasData && <span className="ml-1.5 text-xs text-emerald-400">●</span>}
                  {!hasData && <span className="ml-1.5 text-xs text-orange-400">○</span>}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground">
            {TIER_DESCRIPTIONS[activeTier]}
            {form.portfolioId
              ? ` — Đang chỉnh sửa portfolio #${form.portfolioId}`
              : " — Chưa có dữ liệu, sẽ tạo mới khi lưu"}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="publishedAt">Ngày công bố</Label>
            <Input
              id="publishedAt"
              type="date"
              value={form.publishedAt}
              onChange={(event) =>
                updateCurrentForm((current) => ({
                  ...current,
                  publishedAt: event.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Tổng giá trị thị trường</Label>
            <div className="flex h-10 items-center rounded-md border border-border bg-muted/30 px-3 text-sm font-medium">
              {totalMarketValue.toLocaleString("vi-VN")}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="managerName">Người quản lý</Label>
            <Input
              id="managerName"
              value={form.managerName}
              onChange={(event) =>
                updateCurrentForm((current) => ({
                  ...current,
                  managerName: event.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={form.website}
              onChange={(event) =>
                updateCurrentForm((current) => ({
                  ...current,
                  website: event.target.value,
                }))
              }
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
