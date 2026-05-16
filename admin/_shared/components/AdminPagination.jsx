import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/_shared/components/ui";

export function AdminPagination({ 
  page = 1, 
  total = 0, 
  pageSize = 50, 
  onPageChange,
  onPageSizeChange,
  className = "" 
}) {
  const totalPages = Math.ceil(total / pageSize);
  
  if (total <= pageSize && page === 1) return null;

  return (
    <div className={`flex flex-wrap items-center justify-between gap-6 px-4 py-2 ${className}`}>
      <div className="text-xs font-semibold tracking-wide text-base-content/30">
        Hiển thị <span className="text-base-content/60">{(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)}</span> trong tổng số <span className="text-base-content/60">{total}</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            disabled={page <= 1} 
            onClick={() => onPageChange?.(page - 1)}
            className="rounded-lg h-9 w-9 p-0"
          >
            <ChevronLeft size={16} />
          </Button>
          
          <div className="px-4 py-1.5 bg-base-content/5 border border-base-content/5 rounded-lg text-xs font-semibold text-primary">
            {page} / {totalPages || 1}
          </div>

          <Button 
            variant="ghost" 
            size="sm" 
            disabled={page >= totalPages} 
            onClick={() => onPageChange?.(page + 1)}
            className="rounded-lg h-9 w-9 p-0"
          >
            <ChevronRight size={16} />
          </Button>
        </div>

        <select 
          className="h-9 bg-base-content/5 border border-base-content/5 rounded-lg px-3 text-xs font-semibold tracking-wide outline-none focus:border-primary/50 transition-all cursor-pointer"
          value={pageSize}
          onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
        >
          {[20, 50, 100, 200].map(size => (
            <option key={size} value={size} className="bg-base-200">{size} / trang</option>
          ))}
        </select>
      </div>
    </div>
  );
}
