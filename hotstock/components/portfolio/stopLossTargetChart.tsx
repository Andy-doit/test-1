"use client";

import { useMemo, memo } from "react";
import type { EChartsOption } from "echarts";
import { EChartBase } from "./eChartBase";
import { PALETTE, ANIMATION_OPTS } from "./chartConfig";

type Item = { ticker: string; stop: number; goal: number };

// PERF: [RE-RENDER] Wrap in React.memo
export const StopLossTargetChart = memo(function StopLossTargetChart({ items }: { items: Item[] }) {
  // PERF: [RE-RENDER] Memoize option object
  const option = useMemo<EChartsOption>(() => ({
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    legend: { top: 0, textStyle: { color: "#e5e7eb" } },
    grid: { left: 56, right: 24, bottom: 48, top: 40 },
    xAxis: {
      type: "category",
      data: items.map((i) => i.ticker),
      axisLine: { lineStyle: { color: "#cbd5e1" } },
      axisLabel: { color: "#e5e7eb" },
    },
    yAxis: {
      type: "value",
      axisLine: { lineStyle: { color: "#cbd5e1" } },
      axisLabel: { color: "#e5e7eb" },
      splitLine: { lineStyle: { color: "rgba(148,163,184,0.35)" } },
    },
    color: PALETTE,
    series: [
      {
        name: "Dừng lỗ",
        type: "bar",
        stack: "range",
        data: items.map((i) => i.stop),
        itemStyle: {
          color: "#fb923c",
          borderRadius: [12, 12, 8, 8],
          shadowColor: "rgba(251,146,60,0.35)",
          shadowBlur: 12,
        },
        label: {
          show: true,
          position: "insideTop",
          color: "#0f172a",
          backgroundColor: "rgba(255,255,255,0.9)",
          borderRadius: 6,
          padding: [2, 4],
          formatter: "{c}",
        },
      },
      {
        name: "Mục tiêu",
        type: "bar",
        stack: "range",
        data: items.map((i) => i.goal),
        itemStyle: {
          color: "#34d399",
          borderRadius: [12, 12, 8, 8],
          shadowColor: "rgba(52,211,153,0.35)",
          shadowBlur: 12,
        },
        label: {
          show: true,
          position: "insideBottom",
          color: "#0f172a",
          backgroundColor: "rgba(255,255,255,0.9)",
          borderRadius: 6,
          padding: [2, 4],
          formatter: "{c}",
        },
      },
    ],
    backgroundColor: "transparent",
    ...ANIMATION_OPTS,
  }), [items]);

  return <EChartBase className="w-full h-[420px]" option={option} />;
});
