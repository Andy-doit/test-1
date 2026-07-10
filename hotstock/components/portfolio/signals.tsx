"use client";

import { memo } from "react";

type SignalItem = {
  ticker: string;
  sector: string;
  buy: string;
  sell: string;
};

export const Signals = memo(function Signals({ items }: { items: SignalItem[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pr-1">
      {items.map((item, idx) => (
        <div
          key={item.ticker + idx}
          className="p-4 bg-gradient-to-br from-white to-white dark:from-[#0b0b10] dark:to-[#0f1020] border border-border/60 shadow-sm rounded-xl"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="font-semibold text-purple-600">{item.ticker}</div>
            <div className="text-xs text-muted-foreground">{item.sector}</div>
          </div>
          <div className="space-y-2 text-xs leading-5 text-muted-foreground">
            <div>
              <span className="font-medium text-emerald-600 dark:text-emerald-400">Mua:</span>{" "}
              <span className="whitespace-pre-line">{item.buy}</span>
            </div>
            <div>
              <span className="font-medium text-red-600 dark:text-red-400">Bán:</span>{" "}
              <span className="whitespace-pre-line">{item.sell}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

