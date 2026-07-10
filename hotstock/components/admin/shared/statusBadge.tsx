import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  isPublished: boolean;
  publishedLabel?: string;
  draftLabel?: string;
}

export function StatusBadge({
  isPublished,
  publishedLabel = "Đã xuất bản",
  draftLabel = "Bản nháp",
}: StatusBadgeProps) {
  return isPublished ? (
    <Badge className="text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20 rounded px-1.5 py-0.5">
      {publishedLabel}
    </Badge>
  ) : (
    <Badge className="text-[11px] font-semibold text-muted-foreground border-white/10 bg-white/5 rounded px-1.5 py-0.5">
      {draftLabel}
    </Badge>
  );
}

export function isArticlePublished(publishedAt?: string | null): boolean {
  return !!publishedAt && new Date(publishedAt) <= new Date();
}
