"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdownMenu";

interface DropdownNavItem {
  label: string;
  href: string;
}

interface DropdownNavProps {
  title: string;
  baseHref: string;
  items: readonly DropdownNavItem[];
  className?: string;
}

/**
 * Reusable dropdown navigation component
 * Giảm code duplication cho các dropdown menu (Live, Analysis, Portfolio)
 */
export function DropdownNav({ title, baseHref, items, className }: DropdownNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const closeTimerRef = useRef<number | null>(null);

  const openMenu = useCallback(() => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsOpen(true);
  }, []);

  const scheduleClose = useCallback(() => {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => setIsOpen(false), 120);
  }, []);

  return (
    <span className="inline-flex">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
        <DropdownMenuTrigger asChild>
          <Link
            href={baseHref}
            className="p-0 h-auto bg-transparent m-0 text-sm font-medium text-foreground/80 hover:text-[color:var(--title)] transition-colors inline-flex items-center gap-1 cursor-pointer outline-none border-0 whitespace-nowrap focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus:ring-offset-0 focus-visible:ring-offset-0 hover:bg-transparent"
            onMouseEnter={openMenu}
            onMouseLeave={scheduleClose}
            suppressHydrationWarning
          >
            <span>{title}</span>
            <ChevronDown className={`h-4 w-4 transition-transform duration-150 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
          </Link>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className={`${className || 'w-64 max-w-[18rem]'} max-h-80 overflow-auto z-50`}
          onMouseEnter={openMenu}
          onMouseLeave={scheduleClose}
          sideOffset={5}
        >
          {items.map((item) => (
            <DropdownMenuItem
              key={item.href}
              asChild
              className="whitespace-normal break-words leading-tight py-2 hover:bg-transparent focus:bg-transparent data-[highlighted]:bg-transparent"
            >
              <Link href={item.href}>{item.label}</Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </span>
  );
}

