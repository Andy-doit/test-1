"use client";

import { useMemo, memo } from "react";
import type { EChartsOption } from "echarts";
import { EChartBase } from "./eChartBase";
import { PALETTE, ANIMATION_OPTS } from "./chartConfig";

type Slice = { name: string; value: number };

// PERF: [RE-RENDER] Wrap in React.memo
export const WeightPieChart = memo(function WeightPieChart({ data }: { data: Slice[] }) {
  // PERF: [RE-RENDER] Memoize option object
  const option = useMemo<EChartsOption>(() => ({
    tooltip: { trigger: "item", formatter: "{b}: {d}%" },
    legend: {
      bottom: 10,
      icon: "circle",
      textStyle: { color: "#e5e7eb" },
      backgroundColor: "rgba(15,23,42,0.55)",
      padding: [6, 10],
      borderRadius: 12,
    },
    color: PALETTE,
    series: [
      {
        name: "Tỷ trọng",
        type: "pie",
        radius: ["18%", "72%"],
        avoidLabelOverlap: true,
        minAngle: 8,
        itemStyle: {
          borderColor: "rgba(15,23,42,0.85)",
          borderWidth: 2,
          shadowBlur: 18,
          shadowColor: "rgba(0,0,0,0.35)",
        },
        label: {
          formatter: "{b|{b}}\n{p|{d}%}",
          rich: {
            b: { fontSize: 13, fontWeight: 700, color: "#f8fafc" },
            p: { fontSize: 12, fontWeight: 600, color: "#e2e8f0" },
          },
          backgroundColor: "rgba(15,23,42,0.7)",
          borderRadius: 10,
          padding: [6, 8],
        },
        labelLine: {
          smooth: true,
          length: 14,
          length2: 18,
          lineStyle: { color: "rgba(226,232,240,0.7)" },
        },
        data,
      },
    ],
    graphic: [
      {
        type: "text",
        left: "center",
        top: "middle",
        style: {
          text: "TỶ TRỌNG",
          fill: "#e5e7eb",
          fontSize: 12,
          fontWeight: "bold",
        },
      },
    ],
    backgroundColor: "transparent",
    ...ANIMATION_OPTS,
  }), [data]);

  return <EChartBase className="w-full h-[420px]" option={option} />;
});
