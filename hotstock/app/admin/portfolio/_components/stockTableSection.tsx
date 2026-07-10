import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import type { EditableStock } from "../_lib/portfolioHelpers";
import { CopySectionDropdown } from "./copySectionDropdown";
import { type PortfolioTier } from "@/lib/constants/portfolio";

interface StockTableSectionProps {
  stocks: EditableStock[];
  addStock: () => void;
  updateStock: (id: string, field: keyof EditableStock, value: string) => void;
  removeStock: (id: string) => void;
  clearStocks: () => void;
  activeTier: PortfolioTier;
  handleCopySectionFromTier: (tier: PortfolioTier) => void;
}

export function StockTableSection({
  stocks,
  addStock,
  updateStock,
  removeStock,
  clearStocks,
  activeTier,
  handleCopySectionFromTier,
}: StockTableSectionProps) {
  return (
    <Card className="p-5 space-y-4 bg-[#0A0A0A] border-[#1a1a1a] shadow-none">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[16px] font-semibold text-[#ededed]">Bảng danh sách cổ phiếu</h2>
          <p className="text-[13px] text-[#888]">
            Thông tin chi tiết các mã trong danh mục.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CopySectionDropdown 
            activeTier={activeTier} 
            onCopy={handleCopySectionFromTier} 
          />
          <Button type="button" variant="destructive" onClick={clearStocks} disabled={stocks.length === 0}>
            <Trash2 className="mr-2 h-4 w-4" />
            Xoa block
          </Button>
          <Button type="button" variant="outline" onClick={addStock}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm cổ phiếu
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {stocks.map((stock) => (
          <div key={stock.id} className="rounded-xl border border-[#222] bg-[#111] p-4 space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-medium">{stock.symbol || "Cổ phiếu mới"}</p>
              <Button type="button" variant="ghost" size="icon" onClick={() => removeStock(stock.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-3 md:grid-cols-4">
              <div className="space-y-2">
                <Label>Mã</Label>
                <Input
                  value={stock.symbol}
                  onChange={(event) => updateStock(stock.id, "symbol", event.target.value.toUpperCase())}
                />
              </div>
              <div className="space-y-2">
                <Label>Ngành</Label>
                <Input
                  value={stock.sector}
                  onChange={(event) => updateStock(stock.id, "sector", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Ngày mua</Label>
                <Input
                  type="date"
                  value={stock.purchaseDate}
                  onChange={(event) => updateStock(stock.id, "purchaseDate", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Số lượng</Label>
                <Input
                  type="number"
                  value={stock.quantity}
                  onChange={(event) => updateStock(stock.id, "quantity", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Giá vốn</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={stock.costBasis}
                  onChange={(event) => updateStock(stock.id, "costBasis", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Giá thị trường</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={stock.marketPrice}
                  onChange={(event) => updateStock(stock.id, "marketPrice", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Tỷ trọng mục tiêu (0-1)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={stock.weight}
                  onChange={(event) => updateStock(stock.id, "weight", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Stop loss (giá)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={stock.stopLoss}
                  onChange={(event) => updateStock(stock.id, "stopLoss", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Target price (giá)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={stock.targetPrice}
                  onChange={(event) => updateStock(stock.id, "targetPrice", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Beta</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={stock.beta}
                  onChange={(event) => updateStock(stock.id, "beta", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>MDD (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={stock.mdd}
                  onChange={(event) => updateStock(stock.id, "mdd", event.target.value)}
                />
              </div>
              <div className="space-y-2 md:col-span-4">
                <Label>Ghi chú nội bộ</Label>
                <Input
                  value={stock.note}
                  onChange={(event) => updateStock(stock.id, "note", event.target.value)}
                  placeholder="Ghi chú hỗ trợ admin nhập liệu"
                />
              </div>
            </div>
          </div>
        ))}
        {stocks.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">Chưa có cổ phiếu trong danh mục.</p>
        )}
      </div>
    </Card>
  );
}
