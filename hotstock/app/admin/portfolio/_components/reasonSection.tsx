import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import type { EditableReason } from "../_lib/portfolioHelpers";
import { CopySectionDropdown } from "./copySectionDropdown";
import { type PortfolioTier } from "@/lib/constants/portfolio";

interface ReasonSectionProps {
  reasons: EditableReason[];
  addReason: () => void;
  updateReason: (id: string, field: keyof EditableReason, value: string) => void;
  removeReason: (id: string) => void;
  clearReasons: () => void;
  activeTier: PortfolioTier;
  handleCopySectionFromTier: (tier: PortfolioTier) => void;
}

export function ReasonSection({
  reasons,
  addReason,
  updateReason,
  removeReason,
  clearReasons,
  activeTier,
  handleCopySectionFromTier,
}: ReasonSectionProps) {
  return (
    <Card className="p-5 space-y-4 bg-[#0A0A0A] border-[#1a1a1a] shadow-none">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[16px] font-semibold text-[#ededed]">Lý do hỗ trợ</h2>
          <p className="text-[13px] text-[#888]">Các luận điểm chính cho từng mã.</p>
        </div>
        <div className="flex items-center gap-2">
          <CopySectionDropdown 
            activeTier={activeTier} 
            onCopy={handleCopySectionFromTier} 
          />
          <Button type="button" variant="destructive" onClick={clearReasons} disabled={reasons.length === 0}>
            <Trash2 className="mr-2 h-4 w-4" />
            Xoa block
          </Button>
          <Button type="button" variant="outline" onClick={addReason}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm lý do
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {reasons.map((reason) => (
          <div
            key={reason.id}
            className="grid gap-3 rounded-xl border border-[#222] bg-[#111] p-4 md:grid-cols-[140px_160px_1fr_auto]"
          >
            <div className="space-y-2">
              <Label>Loại</Label>
              <select
                value={reason.type}
                onChange={(event) => updateReason(reason.id, "type", event.target.value)}
                className="flex h-10 w-full rounded-md border border-[#222] bg-[#0A0A0A] px-3 py-2 text-sm text-[#ededed] ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="buy">buy</option>
                <option value="sell">sell</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Mã cổ phiếu</Label>
              <Input
                value={reason.symbol}
                onChange={(event) => updateReason(reason.id, "symbol", event.target.value.toUpperCase())}
              />
            </div>
            <div className="space-y-2">
              <Label>Nội dung</Label>
              <Input
                value={reason.content}
                onChange={(event) => updateReason(reason.id, "content", event.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button type="button" variant="ghost" size="icon" onClick={() => removeReason(reason.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        {reasons.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">Chưa có lý do hỗ trợ.</p>
        )}
      </div>
    </Card>
  );
}
