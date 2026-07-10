"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  isLoading?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Tìm kiếm...",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table returns stable table helpers outside React Compiler's memo model.
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="space-y-4">
      {searchKey && (
        <div className="flex items-center gap-2 max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#555]" />
            <Input
              placeholder={searchPlaceholder}
              value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn(searchKey)?.setFilterValue(event.target.value)
              }
              className="pl-9 bg-[#0A0A0A] border-[#1a1a1a] text-[#ededed] placeholder:text-[#555] focus-visible:ring-0 focus-visible:border-[#333] text-[13px] h-9 rounded-md transition-colors"
            />
          </div>
        </div>
      )}
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
        className="border border-[#222] bg-[#000000] overflow-hidden shadow-[4px_4px_0_#222]"
      >
        <Table>
          <TableHeader className="bg-[#050505] border-b border-[#222]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-b border-[#222]">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-[#888] font-medium text-[12px] h-10 px-4">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-[#0A0A0A] border-b border-[#222] transition-all duration-200 hover:shadow-[inset_2px_0_0_#c084fc]"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-3 text-[13px] text-[#ededed]">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-[#666] text-[13px]">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </motion.div>

      <div className="flex items-center justify-between px-1">
        <div className="text-[12px] text-[#666]">
          Hiển thị trang {table.getState().pagination.pageIndex + 1} /{" "}
          {table.getPageCount() || 1}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-9 w-9 p-0 lg:flex border-[#222] hover:border-[#c084fc] hover:bg-[#111] hover:text-[#c084fc] bg-[#000000] transition-colors rounded-none shadow-[2px_2px_0_#222] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-9 w-9 p-0 border-[#222] hover:border-[#c084fc] hover:bg-[#111] hover:text-[#c084fc] bg-[#000000] transition-colors rounded-none shadow-[2px_2px_0_#222] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-9 w-9 p-0 border-[#222] hover:border-[#c084fc] hover:bg-[#111] hover:text-[#c084fc] bg-[#000000] transition-colors rounded-none shadow-[2px_2px_0_#222] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-9 w-9 p-0 lg:flex border-[#222] hover:border-[#c084fc] hover:bg-[#111] hover:text-[#c084fc] bg-[#000000] transition-colors rounded-none shadow-[2px_2px_0_#222] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

