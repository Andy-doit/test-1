import { memo } from "react";

type TableRow = {
  id: number;
  ticker: string;
  sector?: string;
  purchaseDate?: string;
  cost: number;
  marketPrice: number;
  weight?: number;
  pnl: number;
  stop?: number;
  goal?: number;
  beta?: number;
  mdd?: number;
};

const fmt = (v: number | undefined | null) => v != null ? v.toFixed(2) : "-";

const Pnl = ({ value }: { value: number }) => (
  <span
    className={
      value > 0 ? "text-emerald-500" : value < 0 ? "text-red-500" : "text-muted-foreground"
    }
  >
    {value > 0 ? "+" : ""}
    {fmt(value)}%
  </span>
);

export const PortfolioTable = memo(function PortfolioTable({ rows }: { rows: TableRow[] }) {
  const hasSector = rows.some((r) => r.sector !== undefined && r.sector !== "");
  const hasPurchaseDate = rows.some((r) => r.purchaseDate !== undefined && r.purchaseDate !== "");
  const hasWeight = rows.some((r) => r.weight !== undefined);
  const hasStop = rows.some((r) => r.stop !== undefined);
  const hasGoal = rows.some((r) => r.goal !== undefined);
  const hasBeta = rows.some((r) => r.beta !== undefined);
  const hasMdd = rows.some((r) => r.mdd !== undefined);

  return (
    <div className="overflow-x-auto rounded-lg border border-border/60">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-muted/50 border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
            <th className="px-4 py-3 text-left font-semibold">Mã</th>
            {hasSector && <th className="px-4 py-3 text-left font-semibold">Ngành</th>}
            {hasPurchaseDate && <th className="px-4 py-3 text-left font-semibold">Ngày mua</th>}
            <th className="px-4 py-3 text-right font-semibold">Giá vốn</th>
            <th className="px-4 py-3 text-right font-semibold">Giá TT</th>
            {hasWeight && <th className="px-4 py-3 text-right font-semibold">Tỷ trọng</th>}
            <th className="px-4 py-3 text-right font-semibold">Lãi/lỗ</th>
            {hasStop && <th className="px-4 py-3 text-right font-semibold">Dừng lỗ</th>}
            {hasGoal && <th className="px-4 py-3 text-right font-semibold">Mục tiêu</th>}
            {hasBeta && <th className="px-4 py-3 text-right font-semibold">Beta</th>}
            {hasMdd && <th className="px-4 py-3 text-right font-semibold">MDD</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-border/40 last:border-b-0 hover:bg-muted/30 transition-colors"
            >
              <td className="px-4 py-3 font-semibold">{row.ticker}</td>
              {hasSector && <td className="px-4 py-3 text-muted-foreground">{row.sector}</td>}
              {hasPurchaseDate && <td className="px-4 py-3 text-muted-foreground">{row.purchaseDate ?? "-"}</td>}
              <td className="px-4 py-3 text-right tabular-nums">{fmt(row.cost)}</td>
              <td className="px-4 py-3 text-right tabular-nums">{fmt(row.marketPrice)}</td>
              {hasWeight && (
                <td className="px-4 py-3 text-right tabular-nums">
                  {row.weight !== undefined ? `${fmt(row.weight)}%` : "-"}
                </td>
              )}
              <td className="px-4 py-3 text-right tabular-nums">
                <Pnl value={row.pnl} />
              </td>
              {hasStop && <td className="px-4 py-3 text-right tabular-nums">{fmt(row.stop)}</td>}
              {hasGoal && <td className="px-4 py-3 text-right tabular-nums">{fmt(row.goal)}</td>}
              {hasBeta && <td className="px-4 py-3 text-right tabular-nums">{fmt(row.beta)}</td>}
              {hasMdd && (
                <td className="px-4 py-3 text-right tabular-nums">
                  {row.mdd !== undefined ? `${fmt(row.mdd)}%` : "-"}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
