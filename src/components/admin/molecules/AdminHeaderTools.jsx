import React from "react";
import { IconButton } from "../../ui";
import { Search } from "lucide-react";

export function AdminHeaderTools() {
  return (
    <div className="flex items-center gap-2">
      <IconButton icon={Search} label="Search" variant="ghost" className="opacity-40" />
      <div className="w-px h-6 bg-base-border-subtle mx-2" />
      <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-base-content/5 rounded-full border border-base-border-subtle">
        <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">System Online</span>
      </div>
    </div>
  );
}
