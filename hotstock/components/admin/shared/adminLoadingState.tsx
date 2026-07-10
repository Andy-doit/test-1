import { Loader2 } from "lucide-react";

interface AdminLoadingStateProps {
  message?: string;
}

export function AdminLoadingState({ message = "Đang tải dữ liệu..." }: AdminLoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground space-y-4">
      <Loader2 className="w-8 h-8 animate-spin" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
