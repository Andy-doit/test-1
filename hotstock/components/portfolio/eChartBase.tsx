"use client";

import { useEffect, useRef, useState, memo } from "react";
import type { EChartsOption, ECharts } from "echarts";

interface EChartBaseProps {
  option: EChartsOption;
  className?: string;
}

// Cache the echarts module so it's only imported once
let echartsModule: typeof import("echarts") | null = null;
const echartsPromise: Promise<typeof import("echarts")> = import("echarts").then(
  (mod) => {
    echartsModule = mod;
    return mod;
  },
);

export const EChartBase = memo(function EChartBase({ option, className }: EChartBaseProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<ECharts | null>(null);
  const [ready, setReady] = useState(!!echartsModule);

  // Load echarts module once
  useEffect(() => {
    if (echartsModule) {
      return;
    }
    let cancelled = false;
    echartsPromise.then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Initialize chart and update options
  useEffect(() => {
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
