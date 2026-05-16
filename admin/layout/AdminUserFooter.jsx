import React from "react";
import { ThemeToggle, IconButton, Avatar } from "@/_shared/components/ui";
import { Bell, LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "@/_shared/context/AuthContext";

export function AdminUserFooter() {
  const { user, logout } = useAuth();

  return (
    <div className="mt-auto p-3 border-t border-base-content/5">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <ThemeToggle />
          <IconButton icon={Bell} label="Thông báo" variant="ghost" size="sm" className="text-base-content/40 hover:text-primary transition-colors" />
        </div>

        <div className="group/user flex items-center gap-3 p-2.5 rounded-lg bg-base-content/[0.02] border border-base-content/5 hover:border-primary/20 transition-colors">
          <div className="relative shrink-0">
            <Avatar name={user?.name || user?.email || "A"} size="sm" className="rounded-md border border-base-content/10" />
            <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-success rounded-full border-2 border-base-100" />
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <div className="text-sm font-medium text-base-content truncate">
              {user?.name || "Pi Admin"}
            </div>
            <div className="flex items-center gap-1 text-xs text-base-content/50">
              <ShieldCheck size={11} className="text-primary/70" />
              <span className="truncate">Quản trị viên</span>
            </div>
          </div>

          <IconButton
            icon={LogOut}
            label="Đăng xuất"
            onClick={logout}
            variant="ghost"
            size="sm"
            className="text-base-content/40 hover:text-danger hover:bg-danger/10 transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
