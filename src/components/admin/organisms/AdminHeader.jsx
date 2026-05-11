import React from "react";
import { IconButton } from "../../ui";
import { AdminHeaderTools } from "../molecules/AdminHeaderTools";

export function AdminHeader({ title, onMenuClick }) {
  return (
    <header className="h-20 border-b border-base-border-subtle sticky top-0 z-30 backdrop-blur-md bg-base-100/60 lg:h-24">
      <div className="mx-auto w-full max-w-[1400px] px-12 h-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          <IconButton 
            icon="menu" 
            label="Menu" 
            className="lg:hidden" 
            onClick={onMenuClick} 
          />
          <div className="flex flex-col">
            <h1 className="text-xl font-black uppercase tracking-tight text-base-content leading-none">
              {title}
            </h1>
            <div className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mt-1 opacity-60">
              Pi Ecosystem / System
            </div>
          </div>
        </div>

        <AdminHeaderTools />
      </div>
    </header>
  );
}