// hotstock/components/admin/portfolio/StockTable.tsx

"use client"

import { useMemo, memo } from "react"
import { PencilIcon, TrashIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { DerivedStock, Stock } from "@/types/portfolio"

interface StockTableProps {
  stocks: DerivedStock[]
  onEdit: (stock: Stock) => void
  onDelete: (id: string) => void
}

// PERF: [RE-RENDER] Memoize the table so it only re-renders when stocks
// array reference or the callbacks change.
export const StockTable = memo(function StockTable({ stocks, onEdit, onDelete }: StockTableProps) {
  // PERF: [ALGO] O(N²) → O(N) by precomputing the total weight once
  // and projecting the weight % for each stock in a single pass.
  // Old code called `stocks.reduce(...)` inside `stocks.map(...)` which
  // was O(N²) — for 50 stocks that meant 2,500 iterations per render.
  const rows = useMemo(() => {
    const totalWeight = stocks.reduce((sum, s) => sum + s.weight, 0);
    return stocks.map((s) => ({
      stock: s,
      weightPct: totalWeight > 0 ? (s.weight / totalWeight) * 100 : 0,
      returnPct: s.returnRate * 100,
    }));
  }, [stocks]);

  if (stocks.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-border bg-card p-12 text-muted-foreground">
        Chưa có cổ phiếu nào..
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã</TableHead>
            <TableHead>Ngành</TableHead>
            <TableHead>Ngày mua</TableHead>
            <TableHead className="text-right">Giá vốn</TableHead>
            <TableHead className="text-right">Giá TT</TableHead>
            <TableHead className="text-right">Tỷ trọng</TableHead>
            <TableHead className="text-right">Lãi/lỗ</TableHead>
            <TableHead className="text-right">Dừng lỗ</TableHead>
            <TableHead className="text-right">Mục tiêu</TableHead>
            <TableHead className="text-right">Beta</TableHead>
            <TableHead className="text-right">MDD</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(({ stock: s, weightPct, returnPct }) => (
            <TableRow key={s.id}>
              <TableCell>
                <span className="inline-block rounded bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  {s.ticker}
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground">{s.sector}</TableCell>
              <TableCell>{formatDate(s.buyDate)}</TableCell>
              <TableCell className="text-right tabular-nums">{s.costPrice.toFixed(2)}</TableCell>
              <TableCell className="text-right tabular-nums">{s.marketPrice.toFixed(2)}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <span className="text-xs text-muted-foreground">{weightPct.toFixed(1)}%</span>
                  <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-blue-500"
                      style={{ width: `${Math.min(weightPct, 100)}%` }}
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell className={`text-right tabular-nums font-medium ${returnPct >= 0 ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>
                {returnPct >= 0 ? "+" : ""}{returnPct.toFixed(2)}%
              </TableCell>
              <TableCell className="text-right tabular-nums">{s.stopLoss.toFixed(2)}</TableCell>
              <TableCell className="text-right tabular-nums">{s.targetPrice.toFixed(2)}</TableCell>
              <TableCell className="text-right tabular-nums">{s.beta.toFixed(2)}</TableCell>
              <TableCell className="text-right tabular-nums">{(s.mdd * 100).toFixed(2)}%</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon-sm" onClick={() => onEdit(s)}>
                    <PencilIcon className="h-4 w-4 text-blue-500" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" onClick={() => onDelete(s.id)}>
                    <TrashIcon className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
})

function formatDate(iso: string): string {
  if (!iso) return ""
  const [y, m, d] = iso.split("-")
  return `${d}/${m}/${y}`
}
