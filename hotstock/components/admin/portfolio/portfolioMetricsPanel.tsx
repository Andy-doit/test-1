// hotstock/components/admin/portfolio/PortfolioMetricsPanel.tsx

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import type { PortfolioMetrics } from "@/types/portfolio"

interface PortfolioMetricsPanelProps {
  metrics: PortfolioMetrics
  vnindexReturn: number
  onVnindexChange: (v: number) => void
  onSave: () => Promise<void>
  totalWeight: number
}

export function PortfolioMetricsPanel({ metrics, vnindexReturn, onVnindexChange, onSave, totalWeight }: PortfolioMetricsPanelProps) {
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave()
    } finally {
      setIsSaving(false)
    }
  }

  const portfolioReturnPct = metrics.portfolioReturn * 100
  const alphaPct = metrics.alpha * 100
  const riskPct = metrics.portfolioRisk * 100
  const mddPct = metrics.mddPortfolio * 100

  let weightStatus = ""
  let weightColor = "text-amber-700 dark:text-amber-400"
  if (Math.abs(totalWeight - 1) < 0.001) {
    weightStatus = "Tỷ trọng hợp lệ ✓"
    weightColor = "text-green-700 dark:text-green-400"
  } else if (totalWeight < 1) {
    weightStatus = `Còn thiếu ${((1 - totalWeight) * 100).toFixed(1)}%`
    weightColor = "text-amber-700 dark:text-amber-400"
  } else {
    weightStatus = `Vượt quá ${((totalWeight - 1) * 100).toFixed(1)}%`
    weightColor = "text-red-700 dark:text-red-400"
  }

  return (
    <div className="sticky top-4 space-y-4 rounded-xl border border-border bg-card p-5 shadow-sm">
      <h2 className="text-lg font-semibold">Thông tin danh mục</h2>

      <div className="space-y-3 border-t border-border pt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Tỷ số Sharpe</span>
          <span className="font-mono text-base font-semibold">{metrics.sharpeRatio.toFixed(4)}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Beta danh mục</span>
          <span className="font-mono text-base font-semibold">{metrics.portfolioBeta.toFixed(2)}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Alpha danh mục</span>
          <span className={`font-mono text-base font-semibold ${alphaPct >= 0 ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>
            {alphaPct >= 0 ? "+" : ""}{alphaPct.toFixed(2)}%
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Rủi ro danh mục</span>
          <span className="font-mono text-base font-semibold">{riskPct.toFixed(2)}%</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Tỷ lệ chiết khấu từ đỉnh</span>
          <span className="font-mono text-base font-semibold">{mddPct.toFixed(2)}%</span>
        </div>

        <div className="space-y-1.5 border-t border-border pt-4">
          <label className="text-sm text-muted-foreground">Lợi nhuận VNINDEX từ đầu tuần (%)</label>
          <input
            type="number"
            value={vnindexReturn * 100}
            onChange={(e) => onVnindexChange(parseFloat(e.target.value) / 100)}
            placeholder="VD: 3.37"
            step="0.01"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-medium outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Lợi nhuận danh mục từ đầu tuần</span>
          <span className={`font-mono text-base font-semibold ${portfolioReturnPct >= 0 ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>
            {portfolioReturnPct >= 0 ? "+" : ""}{portfolioReturnPct.toFixed(2)}%
          </span>
        </div>
      </div>

      <div className={`rounded-md border px-3 py-2 text-center text-sm font-medium ${weightColor}`}>{weightStatus}</div>

      <Button onClick={handleSave} disabled={isSaving} className="w-full gap-2">
        {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
        {isSaving ? "Đang lưu..." : "Lưu danh mục"}
      </Button>
    </div>
  )
}
