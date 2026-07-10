import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

export function SectionEmptyState({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
      <p className="text-sm">{message || "Chưa có data để admin cập nhật"}</p>
    </div>
  );
}

interface PortfolioSectionCardProps {
  title?: string | null;
  description?: string | null;
  hasData: boolean;
  children: ReactNode;
  className?: string;
}

export function PortfolioSectionCard({
  title,
  description,
  hasData,
  children,
  className = "p-6 space-y-6",
}: PortfolioSectionCardProps) {
  return (
    <Card className={className}>
      <div className="space-y-1">
        {title && <h3 className="font-semibold text-lg">{title}</h3>}
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {hasData ? children : <SectionEmptyState />}
    </Card>
  );
}
