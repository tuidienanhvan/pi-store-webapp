import React from "react";
import { ThemeToggle, IconButton, Avatar } from "../../ui";
import { useAuth } from "@/context/AuthContext";

export function AdminUserFooter() {
  const { user, logout } = useAuth();

  return (
    <div className="mt-auto p-4 border-t border-base-border-subtle bg-base-300/30">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-1">
          <ThemeToggle />
          <IconButton icon="bell" label="Alerts" variant="ghost" size="sm" className="opacity-50 hover:opacity-100" />
        </div>

        <div className="flex items-center gap-3 p-2 rounded-2xl bg-base-content/[0.03] border border-base-border-subtle/50 group/user">
          <div className="relative">
            <Avatar name={user?.name || user?.email || "A"} size="sm" className="rounded-xl" />
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-success rounded-full border-2 border-base-200 shadow-sm" />
          </div>
          
          <div className="flex flex-col gap-0.5 min-w-0 flex-1">
            <div className="text-[10px] font-black text-base-content truncate uppercase tracking-widest group-hover/user:text-primary transition-colors">
              {user?.name || "Pi Admin"}
            </div>
            <div className="text-[8px] font-black uppercase tracking-[0.1em] text-base-content/40 truncate">
              Super Admin
            </div>
          </div>
          
          <IconButton 
            icon="logout" 
            label="Sign out" 
            onClick={logout} 
            variant="ghost" 
            size="sm" 
            className="opacity-0 group-hover/user:opacity-100 transition-opacity"
          />
        </div>
      </div>
    </div>
  );
}