"use client";

import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

type PortfolioLoadingStateProps = {
  message?: string;
};

export function PortfolioLoadingState({ message = "Đang tải dữ liệu..." }: PortfolioLoadingStateProps) {
  return (
    <Card className="p-6 space-y-3">
      <div className="flex items-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </Card>
  );
}

