import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import type { EditableSignal } from "../_lib/portfolioHelpers";
import { CopySectionDropdown } from "./copySectionDropdown";
import { type PortfolioTier } from "@/lib/constants/portfolio";

interface SignalSectionProps {
  signals: EditableSignal[];
  addSignal: () => void;
  updateSignal: (id: string, field: keyof EditableSignal, value: string) => void;
  removeSignal: (id: string) => void;
  clearSignals: () => void;
  activeTier: PortfolioTier;
  handleCopySectionFromTier: (tier: PortfolioTier) => void;
}

export function SignalSection({
  signals,
  addSignal,
  updateSignal,
  removeSignal,
  clearSignals,
  activeTier,
  handleCopySectionFromTier,
}: SignalSectionProps) {
  return (
    <Card className="p-5 space-y-4 bg-[#0A0A0A] border-[#1a1a1a] shadow-none">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[16px] font-semibold text-[#ededed]">Tín hiệu giao dịch</h2>
          <p className="text-[13px] text-[#888]">Tín hiệu mua/bán và giá mục tiêu.</p>
        </div>
        <div className="flex items-center gap-2">
          <CopySectionDropdown 
            activeTier={activeTier} 
            onCopy={handleCopySectionFromTier} 
          />
          <Button type="button" variant="destructive" onClick={clearSignals} disabled={signals.length === 0}>
            <Trash2 className="mr-2 h-4 w-4" />
            Xoa block
          </Button>
          <Button type="button" variant="outline" onClick={addSignal}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm tín hiệu
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {signals.map((signal) => (
          <div
            key={signal.id}
            className="grid gap-3 rounded-xl border border-[#222] bg-[#111] p-4 md:grid-cols-[140px_160px_1fr_1fr_1fr_auto]"
          >
            <div className="space-y-2">
              <Label>Mã</Label>
              <Input
                value={signal.symbol}
                onChange={(event) => updateSignal(signal.id, "symbol", event.target.value.toUpperCase())}
              />
            </div>
            <div className="space-y-2">
              <Label>Loại tín hiệu</Label>
              <Input
                value={signal.signalType}
                onChange={(event) => updateSignal(signal.id, "signalType", event.target.value)}
                placeholder="BUY / SELL / breakout..."
              />
            </div>
            <div className="space-y-2">
              <Label>Mô tả</Label>
              <Input
                value={signal.description}
                onChange={(event) => updateSignal(signal.id, "description", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Target price</Label>
              <Input
                type="number"
                step="0.01"
                value={signal.targetPrice}
                onChange={(event) => updateSignal(signal.id, "targetPrice", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Stop loss</Label>
              <Input
                type="number"
                step="0.01"
                value={signal.stopLoss}
                onChange={(event) => updateSignal(signal.id, "stopLoss", event.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button type="button" variant="ghost" size="icon" onClick={() => removeSignal(signal.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        {signals.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">Chưa có tín hiệu giao dịch.</p>
        )}
      </div>
    </Card>
  );
}
