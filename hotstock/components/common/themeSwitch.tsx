"use client";
import { Moon, Sun } from "lucide-react";
import { useThemeToggle } from "@/hooks/useThemeToggle";

export default function ThemeToggle() {
  const { effective, toggle, isMounted } = useThemeToggle();
  if (!isMounted) return null;

  return (
    <button
      type="button"
      aria-label="Chuyển giao diện"
      onClick={toggle}
      className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-gray-300/60 text-gray-700 hover:bg-gray-50 dark:border-white/20 dark:text-white dark:hover:bg-white/10 transition-colors"
    >
      {effective ==="dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}


