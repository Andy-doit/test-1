"use client";

import { Column } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

interface SortableColumnHeaderProps<TData> {
  column: Column<TData, unknown>;
  label: string;
}

export function SortableColumnHeader<TData>({ column, label }: SortableColumnHeaderProps<TData>) {
  return (
    <Button
      variant="ghost"
      className="-ml-4 h-8 data-[state=open]:bg-accent"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
}
