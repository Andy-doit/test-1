"use client";

import { memo, useMemo } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

type ReasonRow = {
  ticker: string;
  sector: string;
  type?: "buy" | "sell";
  reason?: string;
  stop: number;
  goal: number;
  beta: number;
  mdd: number;
};

const TYPE_CONFIG = {
  buy: {
    label: "Mua",
    icon: TrendingUp,
    badge: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
    border: "border-l-emerald-500",
    iconColor: "text-emerald-500",
  },
  sell: {
    label: "Bán",
    icon: TrendingDown,
    badge: "bg-rose-500/15 text-rose-500 border-rose-500/30",
    border: "border-l-rose-500",
    iconColor: "text-rose-500",
  },
} as const;

// PERF: [RE-RENDER] Memoize the component so it only re-renders when rows change.
export const SupportReasons = memo(function SupportReasons({ rows }: { rows: ReasonRow[] }) {
  // PERF: [ALGO] O(N) single-pass construction — avoids double-filtering if
  // the same ticker appeared multiple times with the same type.
  const renderedRows = useMemo(() => {
    return rows.map((row, idx) => {
      const typeKey = row.type === "sell" ? "sell" : "buy";
      const config = TYPE_CONFIG[typeKey];
      const Icon = config.icon;
      // Stable key: ticker + type + index. Using index alone would break if the
      // same ticker appears in multiple entries with different types.
      const key = `${row.ticker}-${typeKey}-${idx}`;
      return { row, config, Icon, key };
    });
  }, [rows]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pr-1">
      {renderedRows.map(({ row, config, Icon, key }) => (
        <div
          key={key}
          className={`p-4 bg-gradient-to-br from-white to-white dark:from-[#0b0b10] dark:to-[#0f1020] border border-border/60 border-l-4 ${config.border} shadow-sm rounded-xl`}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Icon className={`h-4 w-4 shrink-0 ${config.iconColor}`} />
              <span className="font-semibold text-purple-600 truncate">{row.ticker}</span>
              <span
                className={`shrink-0 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${config.badge}`}
              >
                {config.label}
              </span>
            </div>
            <div className="text-xs text-muted-foreground shrink-0">{row.sector}</div>
          </div>
          <div className="mt-3 text-xs leading-5 text-muted-foreground space-y-2">
            {row.reason ? (
              <p className="whitespace-pre-line">{row.reason}</p>
            ) : (
              <>
                <p>
                  • MA/Trend: MA200/MA100/VWMA hỗ trợ; xu hướng ngắn hạn giữ trên đường hỗ trợ chính.
                </p>
                <p>
                  • Động lượng: MACD cắt lên tín hiệu, histogram dương; volume cải thiện quanh vùng hỗ trợ.
                </p>
                <p>
                  • Vùng giá: Dừng lỗ {row.stop.toFixed(2)}, mục tiêu {row.goal.toFixed(2)}; beta{" "}
                  {row.beta.toFixed(2)}, MDD {row.mdd.toFixed(2)}%.
                </p>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
});
