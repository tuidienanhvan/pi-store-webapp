import React from "react";
import { IconButton } from "@/_shared/components/ui";
import { Menu } from "lucide-react";
import { AdminHeaderTools } from "./AdminHeaderTools";

export function AdminHeader({ title, onMenuClick }) {
  return (
    <header className="h-14 border-b border-white/5 sticky top-0 z-30 backdrop-blur-xl bg-base-100/60">
      <div className="mx-auto w-full max-w-[1600px] px-6 lg:px-10 h-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <IconButton
            icon={Menu}
            label="Menu"
            className="lg:hidden text-base-content/70 hover:bg-white/5 transition-colors"
            onClick={onMenuClick}
          />
          <h1 className="text-sm lg:text-base font-semibold text-base-content">
            {title}
          </h1>
        </div>

        <AdminHeaderTools />
      </div>
    </header>
  );
}
