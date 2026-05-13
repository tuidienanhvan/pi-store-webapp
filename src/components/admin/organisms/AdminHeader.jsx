import React from "react";
import { IconButton } from "../../ui";
import { Menu } from "lucide-react";
import { AdminHeaderTools } from "../molecules/AdminHeaderTools";

export function AdminHeader({ title, onMenuClick }) {
  return (
    <header className="h-24 border-b border-white/5 sticky top-0 z-30 backdrop-blur-xl bg-base-100/40 lg:h-28 transition-all">
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
      <div className="mx-auto w-full max-w-[1400px] px-12 h-full flex items-center justify-between relative z-10">
        <div className="flex items-center gap-6">
          <IconButton 
            icon={Menu} 
            label="Menu" 
            className="lg:hidden text-primary" 
            onClick={onMenuClick} 
          />
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-black uppercase tracking-[-0.02em] text-base-content leading-none font-display">
              {title}
            </h1>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_var(--p)]" />
              <div className="text-[10px] font-black text-primary/60 uppercase tracking-[0.3em]">
                Quantum HUD / Admin
              </div>
            </div>
          </div>
        </div>

        <AdminHeaderTools />
      </div>
    </header>
  );
}
