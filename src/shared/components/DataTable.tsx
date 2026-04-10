import { Search, SearchX } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination } from './Pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  paginatedData: T[];
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  setPage: (p: number) => void;
  setPageSize: (s: number) => void;
  searchPlaceholder?: string;
  loading?: boolean;
  actions?: (item: T) => React.ReactNode;
  headerRight?: React.ReactNode;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  paginatedData,
  searchTerm,
  setSearchTerm,
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  setPage,
  setPageSize,
  searchPlaceholder = 'Search…',
  loading = false,
  actions,
  headerRight,
}: DataTableProps<T>) {
  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-[14px] w-[14px] text-muted-foreground/60 pointer-events-none" />
          <Input
            className="pl-8 h-8 text-[13px]"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {headerRight && <div className="flex items-center gap-2">{headerRight}</div>}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 border-b border-border hover:bg-muted/30">
              {columns.map((col) => (
                <TableHead key={col.key} className={col.className}>
                  {col.label}
                </TableHead>
              ))}
              {actions && <TableHead className="w-28 text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      <Skeleton className="h-4 w-full max-w-[160px] rounded" />
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell>
                      <Skeleton className="h-4 w-14 ml-auto rounded" />
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : paginatedData.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="py-16 text-center"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                      <SearchX className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-[13px] font-medium text-foreground">No results found</p>
                    <p className="text-[12px] text-muted-foreground">Try adjusting your search.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item, i) => (
                <TableRow key={i}>
                  {columns.map((col) => (
                    <TableCell key={col.key} className={col.className}>
                      {col.render ? col.render(item) : String(item[col.key] ?? '—')}
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell className="text-right">{actions(item)}</TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        setPage={setPage}
        setPageSize={setPageSize}
      />
    </div>
  );
}
