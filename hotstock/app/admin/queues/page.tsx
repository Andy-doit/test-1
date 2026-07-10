"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useQueueStats } from "@/hooks/admin/useQueueStats";

const QueueChart = dynamic(() => import("@/components/admin/queueChart"), {
  ssr: false,
  loading: () => <Skeleton className="h-[300px] w-full bg-[#111]" />,
});

// Static system queues known to exist — populated from backend stats when available
const KNOWN_QUEUES = ["email-queue"];

export default function AdminQueuesPage() {
  const { data: queues, isLoading, error } = useQueueStats();

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[22px] font-semibold tracking-tight text-[#ededed]">Giám sát hàng đợi (BullMQ)</h2>
          <p className="text-[14px] text-[#888] mt-1">
            Theo dõi các tác vụ nền và trạng thái của hàng đợi Redis.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="bg-[#111] border-[#222] hover:bg-[#222] text-[#888] text-xs"
          onClick={() => window.open("/api/docs", "_blank")}
        >
          Xem API Docs
        </Button>
      </div>

      <Card className="bg-[#0A0A0A] border-[#1a1a1a] shadow-none">
        <CardHeader className="pb-4">
          <CardTitle className="text-[14px] font-medium text-[#ededed]">Hiệu suất tác vụ (7 ngày qua)</CardTitle>
          <CardDescription className="text-[#888]">Biểu đồ trực quan hóa khối lượng công việc được xử lý.</CardDescription>
        </CardHeader>
        <CardContent>
          <QueueChart />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading && KNOWN_QUEUES.map((name) => (
          <Card key={name} className="bg-[#0A0A0A] border-[#1a1a1a] shadow-none">
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-32 bg-[#1a1a1a]" />
              <Skeleton className="h-3 w-24 mt-1 bg-[#1a1a1a]" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-8 bg-[#1a1a1a]" />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {!isLoading && error && (
          <Card className="col-span-full bg-[#0A0A0A] border-[#1a1a1a] shadow-none">
            <CardContent className="py-8 text-center">
              <p className="text-[#888] text-sm">Không thể tải trạng thái hàng đợi.</p>
              <p className="text-[#444] text-xs mt-1">Kiểm tra kết nối backend và Redis.</p>
            </CardContent>
          </Card>
        )}

        {!isLoading && queues && queues.length === 0 && (
          <Card className="col-span-full bg-[#0A0A0A] border-[#1a1a1a] shadow-none">
            <CardContent className="py-8 text-center">
              <p className="text-[#888] text-sm">Không có dữ liệu hàng đợi</p>
              <p className="text-[#444] text-xs mt-1">Backend chưa expose BullMQ stats endpoint. Thêm endpoint /dashboard/queues trên backend.</p>
            </CardContent>
          </Card>
        )}

        {!isLoading && queues && queues.map((queue) => (
          <Card key={queue.name} className="bg-[#0A0A0A] border-[#1a1a1a] shadow-none hover:bg-[#111] transition-colors duration-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-[#ededed] font-medium">{queue.name}</CardTitle>
              <CardDescription className="text-[#666] text-xs">Redis BullMQ Worker</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="flex flex-col">
                  <span className="text-2xl font-semibold tracking-tight text-blue-500">{queue.active}</span>
                  <span className="text-[10px] text-[#666] font-medium uppercase tracking-wider">Active</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-semibold tracking-tight text-yellow-500">{queue.waiting}</span>
                  <span className="text-[10px] text-[#666] font-medium uppercase tracking-wider">Waiting</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-semibold tracking-tight text-emerald-500">{queue.completed}</span>
                  <span className="text-[10px] text-[#666] font-medium uppercase tracking-wider">Completed</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-semibold tracking-tight text-rose-500">{queue.failed}</span>
                  <span className="text-[10px] text-[#666] font-medium uppercase tracking-wider">Failed</span>
                </div>
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t border-[#1a1a1a]">
                <Button variant="outline" size="sm" className="w-full bg-[#111] border-[#222] hover:bg-[#222] text-[#ededed] text-xs">
                  Xem tác vụ
                </Button>
                {queue.failed > 0 && (
                  <Button variant="destructive" size="sm" className="w-full text-xs">
                    Thử lại lỗi
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
