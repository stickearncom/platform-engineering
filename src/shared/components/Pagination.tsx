import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
}

const PAGE_SIZES = [5, 10, 20];

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  setPage,
  setPageSize,
}: PaginationProps) {
  const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);
  const pages = buildPageRange(currentPage, totalPages);

  return (
    <div className="flex items-center justify-between py-1">
      <p className="text-[12px] text-muted-foreground tabular-nums">
        {totalItems === 0
          ? 'No results'
          : `Showing ${start}–${end} of ${totalItems}`}
      </p>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
          <span>Per page</span>
          <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
            <SelectTrigger className="h-7 w-14 text-[12px] rounded-md border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZES.map((s) => (
                <SelectItem key={s} value={String(s)} className="text-[12px]">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            disabled={currentPage <= 1}
            onClick={() => setPage(currentPage - 1)}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>

          {pages.map((p, i) =>
            p === '...' ? (
              <span key={`ellipsis-${i}`} className="px-1.5 text-[12px] text-muted-foreground">
                …
              </span>
            ) : (
              <button
                key={p}
                className={cn(
                  'h-7 w-7 rounded-md text-[12px] font-medium transition-colors',
                  p === currentPage
                    ? 'bg-indigo-600 text-white'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
                onClick={() => setPage(p as number)}
              >
                {p}
              </button>
            ),
          )}

          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            disabled={currentPage >= totalPages}
            onClick={() => setPage(currentPage + 1)}
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function buildPageRange(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, '...', total];
  if (current >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
  return [1, '...', current - 1, current, current + 1, '...', total];
}
