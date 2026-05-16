import React from "react";
import { IconButton } from "@/_shared/components/ui";
import { Search, Globe, Zap } from "lucide-react";

export function AdminHeaderTools() {
  return (
    <div className="flex items-center gap-3">
      <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-md bg-base-content/[0.03] border border-base-content/5 text-xs text-base-content/60">
        <span className="inline-flex items-center gap-1.5">
          <Globe size={12} className="text-base-content/40" /> Trực tuyến
        </span>
        <span className="w-px h-3 bg-base-content/10" />
        <span className="inline-flex items-center gap-1.5">
          <Zap size={12} className="text-base-content/40" /> Phản hồi tốt
        </span>
      </div>

      <IconButton icon={Search} label="Tìm kiếm" variant="ghost" className="text-base-content/50 hover:text-primary transition-colors" />
    </div>
  );
}
