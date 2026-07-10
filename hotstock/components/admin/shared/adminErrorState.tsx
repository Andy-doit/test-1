import { AlertCircle } from "lucide-react";

interface AdminErrorStateProps {
  message?: string;
  error?: Error | unknown;
}

export function AdminErrorState({ message, error }: AdminErrorStateProps) {
  const errorMessage = message ?? (error instanceof Error ? error.message : "Đã có lỗi xảy ra.");

  return (
    <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 flex items-center gap-3">
      <AlertCircle className="w-5 h-5 shrink-0" />
      <p>{errorMessage}</p>
    </div>
  );
}
