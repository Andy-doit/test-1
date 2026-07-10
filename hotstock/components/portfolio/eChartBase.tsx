"use client";

import { useEffect, useRef, useState, memo } from "react";
import type { EChartsOption, ECharts } from "echarts";

interface EChartBaseProps {
  option: EChartsOption;
  className?: string;
}

export const EChartBase = memo(function EChartBase({ option, className }: EChartBaseProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<ECharts | null>(null);
  // Per-instance module handle instead of a module-level singleton: each of
  // performanceChart/weightPieChart/stopLossTargetChart is now its own
  // next/dynamic() boundary, so eChartBase.tsx (and this file's module-scope
  // state) is duplicated per chunk. A shared `echartsModule`/`echartsPromise`
  // singleton combined with React StrictMode's dev-only double effect
  // invoke (mount -> cleanup -> mount) could leave the chart disposed by the
  // synthetic cleanup without ever being re-initialized, depending on when the
  // async import resolved relative to that cycle — this component simply
  // avoids sharing that mutable state across instances.
  const echartsModuleRef = useRef<typeof import("echarts") | null>(null);
  const [ready, setReady] = useState(false);

  // Load echarts module for this instance
  useEffect(() => {
    let cancelled = false;
    import("echarts").then((mod) => {
      if (cancelled) return;
      echartsModuleRef.current = mod;
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Initialize chart and update options
  useEffect(() => {
    const echartsModule = echartsModuleRef.current;
    if (!ready || !ref.current || !echartsModule) return;

    // Initialize chart instance if not already created
    if (!chartRef.current) {
      chartRef.current = echartsModule.init(ref.current);
    }

    chartRef.current.setOption(option, { notMerge: true });
  }, [ready, option]);

  // Handle resize
  useEffect(() => {
    if (!ready || !ref.current || !chartRef.current) return;

    const chart = chartRef.current;
    const container = ref.current;

    const handleResize = () => {
      chart.resize();
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    window.addEventListener("resize", handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [ready]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.dispose();
        chartRef.current = null;
      }
    };
  }, []);

  return <div ref={ref} className={className ?? "w-full h-64"} style={{ minHeight: "200px" }} />;
});
