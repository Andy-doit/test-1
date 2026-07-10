import type { User } from "@/types/iAccount";

export function getInitials(user: User | null): string {
  if (!user) return "U";
  return user.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U";
}

export function formatUserDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

