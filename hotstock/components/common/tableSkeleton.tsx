"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

/**
 * Skeleton loader cho Table component
 */
export function TableSkeleton({ rows = 5, columns = 9 }: TableSkeletonProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-[960px] w-full text-sm">
        <thead>
          <tr className="border-b border-border/60 bg-muted/40 text-xs uppercase">
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="px-3 py-2">
                <Skeleton className="h-4 w-16 mx-auto" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className="border-b border-border/40">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="px-3 py-2">
                  <Skeleton className="h-4 w-20" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

