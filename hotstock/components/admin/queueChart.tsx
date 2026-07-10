"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const DATA = [
  { date: "04/06", completed: 150, failed: 2 },
  { date: "05/06", completed: 230, failed: 5 },
  { date: "06/06", completed: 180, failed: 1 },
  { date: "07/06", completed: 320, failed: 4 },
  { date: "08/06", completed: 290, failed: 8 },
  { date: "09/06", completed: 410, failed: 3 },
  { date: "10/06", completed: 380, failed: 2 },
];

export default function QueueChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorFailed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1a1a1a" />
          <XAxis
            dataKey="date"
            stroke="#666"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#666"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0A0A0A",
              borderColor: "#1a1a1a",
              borderRadius: "6px",
              fontSize: "12px",
              color: "#ededed",
            }}
            itemStyle={{ color: "#ededed" }}
          />
          <Legend
            verticalAlign="top"
            height={36}
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: "12px" }}
          />
          <Area
            name="Thành công (Completed)"
            type="monotone"
            dataKey="completed"
            stroke="#10b981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorCompleted)"
          />
          <Area
            name="Thất bại (Failed)"
            type="monotone"
            dataKey="failed"
            stroke="#ef4444"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorFailed)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}