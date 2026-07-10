"use client";

import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

type PortfolioErrorStateProps = {
  title?: string;
  message?: string;
};

export function PortfolioErrorState({
  title = "Không thể tải dữ liệu",
  message = "Có lỗi xảy ra khi tải danh mục. Vui lòng thử lại sau.",
}: PortfolioErrorStateProps) {
  return (
    <Card className="p-6 space-y-3">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 mt-0.5 text-destructive" />
        <div>
          <h3 className="font-semibold text-base">{title}</h3>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </div>
    </Card>
  );
}

