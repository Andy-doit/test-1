import { Badge } from "@/components/ui/badge";

type Role = "admin" | "editor" | "user" | string;

const roleConfig: Record<string, { label: string; className: string }> = {
  admin: {
    label: "Admin",
    className:
      "text-[11px] font-semibold bg-amber-500/10 text-amber-400 border-amber-500/20 rounded px-1.5 py-0.5",
  },
  editor: {
    label: "Editor",
    className:
      "text-[11px] font-semibold bg-blue-500/10 text-blue-400 border-blue-500/20 rounded px-1.5 py-0.5",
  },
  user: {
    label: "User",
    className:
      "text-[11px] font-semibold border-white/10 bg-white/5 text-muted-foreground rounded px-1.5 py-0.5",
  },
};

interface RoleBadgeProps {
  role?: Role | null;
}

export function RoleBadge({ role }: RoleBadgeProps) {
  const normalized = role?.toLowerCase() ?? "user";
  const config = roleConfig[normalized] ?? roleConfig.user;

  return <Badge className={config.className}>{config.label}</Badge>;
}
