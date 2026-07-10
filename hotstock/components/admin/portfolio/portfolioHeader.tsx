// hotstock/components/admin/portfolio/PortfolioHeader.tsx

"use client"

import type { PortfolioMeta } from "@/types/portfolio"

interface PortfolioHeaderProps {
  meta: PortfolioMeta
  onChange: (meta: PortfolioMeta) => void
}

export function PortfolioHeader({ meta, onChange }: PortfolioHeaderProps) {
  const updateMeta = (field: keyof PortfolioMeta, value: string) => {
    onChange({
      ...meta,
      [field]: field === "vnindexReturn" ? Number(value) : value,
    })
  }

  return (
    <header className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-[1.4fr_1fr_1fr_180px] md:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Portfolio Tracker</p>
          <h1 className="mt-2 text-2xl font-bold leading-tight">CẬP NHẬT HIỆU SUẤT DANH MỤC CỘNG ĐỒNG</h1>
        </div>

        <label className="space-y-1.5 text-sm">
          <span className="text-muted-foreground">Tên quản lý</span>
          <input
            value={meta.managerName}
            onChange={(event) => updateMeta("managerName", event.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm font-medium outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
          />
        </label>

        <label className="space-y-1.5 text-sm">
          <span className="text-muted-foreground">Website</span>
          <input
            value={meta.website}
            onChange={(event) => updateMeta("website", event.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm font-medium outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
          />
        </label>

        <label className="space-y-1.5 text-sm">
          <span className="text-muted-foreground">Ngày tuần</span>
          <input
            type="date"
            value={meta.weekDate}
            onChange={(event) => updateMeta("weekDate", event.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm font-medium outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
          />
        </label>
      </div>
    </header>
  )
}