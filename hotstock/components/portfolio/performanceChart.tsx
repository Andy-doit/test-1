"use client";

import { useMemo, memo } from "react";
import type { EChartsOption } from "echarts";
import type { CallbackDataParams } from "echarts/types/dist/shared";
import { EChartBase } from "./eChartBase";

type Props = {
  categories: string[];
  reco: number[];
  index: number[];
};

interface TooltipParams extends CallbackDataParams {
  seriesName: string;
  data: number;
  color: string;
  axisValueLabel: string;
}

// PERF: [RE-RENDER] Wrap in React.memo
export const PerformanceChart = memo(function PerformanceChart({ categories, reco, index }: Props) {
  // PERF: [RE-RENDER] Memoize option object
  const option = useMemo<EChartsOption>(() => ({
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(15,23,42,0.9)",
      borderColor: "rgba(255,255,255,0.08)",
      textStyle: { color: "#e5e7eb", fontWeight: 600 },
      formatter: (params: unknown) => {
        if (!Array.isArray(params) || params.length === 0) return "";
        const tooltipParams = params as TooltipParams[];
        const items = tooltipParams
          .map(
            (p) =>
              `<div style="margin:2px 0;display:flex;justify-content:space-between;gap:12px;">
                <span style="color:${p.color}">${p.seriesName}</span>
                <span style="color:#f8fafc;font-weight:700">${p.data.toFixed(1)}%</span>
              </div>`,
          )
          .join("");
        return `<div style="padding:6px 8px;">${tooltipParams[0].axisValueLabel}<br/>${items}</div>`;
      },
    },
    legend: {
      top: 0,
      right: 0,
      textStyle: { color: "#e5e7eb", fontWeight: 600 },
      icon: "circle",
    },
    xAxis: {
      type: "category",
      data: categories,
      axisLine: { lineStyle: { color: "#cbd5e1" } },
      axisLabel: { color: "#e5e7eb" },
    },
    yAxis: {
      type: "value",
      axisLabel: { formatter: "{value}%", color: "#e5e7eb" },
      axisLine: { lineStyle: { color: "#cbd5e1" } },
      splitLine: { lineStyle: { color: "rgba(148,163,184,0.35)" } },
    },
    series: [
      {
        name: "Khuyến nghị",
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 10,
        lineStyle: { width: 3.5, color: "#f97316" },
        itemStyle: { color: "#f97316", shadowBlur: 10, shadowColor: "rgba(249,115,22,0.4)" },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(249,115,22,0.25)" },
              { offset: 1, color: "rgba(249,115,22,0.05)" },
            ],
          },
        },
        data: reco,
      },
      {
        name: "VN-Index",
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 10,
        lineStyle: { width: 3.5, color: "#3b82f6" },
        itemStyle: { color: "#3b82f6", shadowBlur: 10, shadowColor: "rgba(59,130,246,0.4)" },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(59,130,246,0.25)" },
              { offset: 1, color: "rgba(59,130,246,0.05)" },
            ],
          },
        },
        data: index,
      },
    ],
    grid: { left: 56, right: 24, top: 48, bottom: 48 },
    backgroundColor: "transparent",
  }), [categories, reco, index]);

  return <EChartBase className="w-full h-[420px]" option={option} />;
});


