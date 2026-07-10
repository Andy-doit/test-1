"use client";

import { useMemo, memo } from "react";
import type { EChartsOption } from "echarts";
import { EChartBase } from "./eChartBase";
import { ANIMATION_OPTS } from "./chartConfig";

type Metric = { name: string; value: number };

/** Narrow ECharts tooltip formatter param to the fields we read. */
interface TooltipParam {
  name: string;
  value: number;
}

/** Narrow ECharts label formatter param. */
interface LabelParam {
  name: string;
  value: number;
}

// PERF: [RE-RENDER] Wrap in React.memo to keep re-renders local to the chart
export const BasicsChart = memo(function BasicsChart({ metrics }: { metrics: Metric[] }) {
  // PERF: [RE-RENDER] Memoize the option object — only rebuild when metrics change
  const option = useMemo<EChartsOption>(() => ({
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (params: unknown) => {
        const list = Array.isArray(params) ? (params as TooltipParam[]) : [params as TooltipParam];
        const param = list[0];
        if (!param) return "";
        const isRatio = param.name === "Tỷ số Sharpe" || param.name === "Beta";
        const suffix = isRatio ? "" : "%";
        return `${param.name}: <b>${param.value}${suffix}</b>`;
      },
    },
    grid: { left: 160, right: 35, bottom: 48, top: 32 },
    xAxis: {
      type: "value",
      axisLabel: { formatter: "{value}", color: "#e5e7eb" },
      axisLine: { lineStyle: { color: "#cbd5e1" } },
      splitLine: { lineStyle: { color: "rgba(148,163,184,0.35)" } },
    },
    yAxis: {
      type: "category",
      data: metrics.map((m) => m.name),
      axisLine: { lineStyle: { color: "#cbd5e1" } },
      axisLabel: { color: "#e5e7eb" },
    },
    series: [
      {
        type: "bar",
        data: metrics.map((m) => m.value),
        label: {
          show: true,
          position: "right",
          formatter: (params: unknown) => {
            const p = params as LabelParam;
            const isRatio = p.name === "Tỷ số Sharpe" || p.name === "Beta";
            return `${p.value}${isRatio ? "" : "%"}`;
          },
          fontWeight: 700,
          color: "#0f172a",
          backgroundColor: "rgba(255,255,255,0.92)",
          borderRadius: 6,
          padding: [3, 6],
        },
        itemStyle: {
          color: "#6366f1",
          borderRadius: [12, 12, 12, 12],
          shadowColor: "rgba(99,102,241,0.35)",
          shadowBlur: 12,
        },
        barWidth: 20,
      },
    ],
    backgroundColor: "transparent",
    ...ANIMATION_OPTS,
  }), [metrics]);

  return <EChartBase className="w-full h-[420px]" option={option} />;
});


