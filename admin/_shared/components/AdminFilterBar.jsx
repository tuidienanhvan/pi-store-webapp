import React from 'react';
import { Search, X } from 'lucide-react';
import { Button } from "@/_shared/components/ui";

export function AdminFilterBar({ 
  search, 
  onSearchChange, 
  onClear,
  children,
  className = "" 
}) {
  return (
    <div className={`flex flex-wrap items-center gap-4 p-4 bg-base-200/40 backdrop-blur-md border border-base-content/10 rounded-xl ${className}`}>
      <div className="relative flex-1 min-w-[240px]">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/30" />
        <input 
          type="text"
          placeholder="Tìm kiếm..."
          className="w-full h-10 bg-base-content/5 border border-base-content/5 rounded-xl pl-12 pr-4 text-sm font-semibold focus:border-primary/50 focus:bg-base-content/10 outline-none transition-all"
          value={search || ""}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
        {search && (
          <button 
            onClick={onClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-primary transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {children}
      </div>
    </div>
  );
}
