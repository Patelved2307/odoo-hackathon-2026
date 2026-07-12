import { useState, useMemo, type ReactNode } from "react";
import {
  useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel,
  flexRender, type ColumnDef, type SortingState,
} from "@tanstack/react-table";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Search, Inbox } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "./EmptyState";

interface Props<T> {
  data: T[];
  columns: ColumnDef<T, any>[];
  searchPlaceholder?: string;
  toolbar?: ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  pageSize?: number;
}

export function DataTable<T>({ data, columns, searchPlaceholder = "Search…", toolbar, emptyTitle = "No results", emptyDescription = "Try adjusting your filters.", pageSize = 10 }: Props<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data, columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });

  const rows = table.getRowModel().rows;
  const totalRows = table.getFilteredRowModel().rows.length;
  const pageIndex = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();
  const start = useMemo(() => pageIndex * pageSize + 1, [pageIndex, pageSize]);
  const end = Math.min(start + rows.length - 1, totalRows);

  return (
    <div className="card-surface overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 p-4 border-b border-[#E2E8F0]">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
          <Input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-9 h-9 bg-white border-[#E2E8F0]"
          />
        </div>
        <div className="ml-auto flex items-center gap-2">{toolbar}</div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id} className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                {hg.headers.map(h => (
                  <th key={h.id} className="text-left px-4 py-2.5 text-[12px] font-semibold uppercase tracking-wide text-[#64748B]">
                    {h.isPlaceholder ? null : (
                      <button
                        onClick={h.column.getToggleSortingHandler()}
                        className="inline-flex items-center gap-1 hover:text-[#0F172A]"
                      >
                        {flexRender(h.column.columnDef.header, h.getContext())}
                        {h.column.getIsSorted() === "asc" && <ChevronUp className="h-3.5 w-3.5" />}
                        {h.column.getIsSorted() === "desc" && <ChevronDown className="h-3.5 w-3.5" />}
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {rows.map((row, i) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: Math.min(i * 0.015, 0.15) }}
                  className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors"
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-4 py-3 text-[#0F172A]">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>

        {rows.length === 0 && (
          <EmptyState icon={Inbox} title={emptyTitle} description={emptyDescription} />
        )}
      </div>

      {totalRows > 0 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#E2E8F0] text-xs text-[#64748B]">
          <div>Showing <span className="text-[#0F172A] font-medium">{start}–{end}</span> of <span className="text-[#0F172A] font-medium">{totalRows}</span></div>
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="h-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-2">Page {pageIndex + 1} of {pageCount || 1}</span>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="h-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
