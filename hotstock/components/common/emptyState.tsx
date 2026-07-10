import { ReactNode } from "react";
import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  className?: string;
};

export function EmptyState({ title, description, icon, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/20 bg-white/[0.03] px-6 py-10 text-center shadow-[0_18px_45px_rgba(8,3,20,0.35)] dark:border-white/10 dark:bg-white/[0.02]",
        className
      )}
    >
      <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#8b5cf6]/25 to-[#ec4899]/20 text-[#c4b5fd]">
        {icon ?? <Sparkles className="h-7 w-7" />}
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-foreground/70">{description}</p>}
    </div>
  );
}

