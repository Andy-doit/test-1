import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import type { EditableInformation } from "../_lib/portfolioHelpers";
import { CopySectionDropdown } from "./copySectionDropdown";
import { type PortfolioTier } from "@/lib/constants/portfolio";

interface PerformanceSectionProps {
  information: EditableInformation[];
  addInformation: () => void;
  updateInfo: (id: string, field: keyof EditableInformation, value: string) => void;
  removeInformation: (id: string) => void;
  clearInformation: () => void;
  activeTier: PortfolioTier;
  handleCopySectionFromTier: (tier: PortfolioTier) => void;
}

export function PerformanceSection({
  information,
  addInformation,
  updateInfo,
  removeInformation,
  clearInformation,
  activeTier,
  handleCopySectionFromTier,
}: PerformanceSectionProps) {
  return (
    <Card className="p-5 space-y-4 bg-[#0A0A0A] border-[#1a1a1a] shadow-none">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[16px] font-semibold text-[#ededed]">Biểu đồ hiệu suất</h2>
          <p className="text-[13px] text-[#888]">Nhập dữ liệu cho chart &quot;Hiệu suất danh mục vs VNINDEX&quot;.</p>
        </div>
        <div className="flex items-center gap-2">
          <CopySectionDropdown 
            activeTier={activeTier} 
            onCopy={handleCopySectionFromTier} 
          />
          <Button type="button" variant="destructive" onClick={clearInformation} disabled={information.length === 0}>
            <Trash2 className="mr-2 h-4 w-4" />
            Xoa block
          </Button>
          <Button type="button" variant="outline" onClick={addInformation}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm mốc
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {information.map((item) => (
          <div
            key={item.id}
            className="grid gap-3 rounded-xl border border-[#222] bg-[#111] p-4 md:grid-cols-[1fr_1fr_1fr_auto]"
          >
            <div className="space-y-2">
              <Label>Mốc thời gian</Label>
              <Input
                type="date"
                value={item.month}
                onChange={(event) => updateInfo(item.id, "month", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>VNINDEX (%)</Label>
              <Input
                type="number"
                step="0.01"
                value={item.vnindexReturn}
                onChange={(event) => updateInfo(item.id, "vnindexReturn", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Khuyến nghị (%)</Label>
              <Input
                type="number"
                step="0.01"
                value={item.recommendReturn}
                onChange={(event) => updateInfo(item.id, "recommendReturn", event.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button type="button" variant="ghost" size="icon" onClick={() => removeInformation(item.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        {information.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">Chưa có dữ liệu hiệu suất.</p>
        )}
      </div>
    </Card>
  );
}
