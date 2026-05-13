import React from "react";
import PiLogo from "@pi-ui/base/PiLogo";
import { NavGroup } from "../molecules/NavGroup";
import { AdminUserFooter } from "../molecules/AdminUserFooter";

export function AdminSidebar({ nav = [], onLinkClick }) {
  return (
    <div className="flex flex-col h-full bg-base-200/20">
      {/* Brand Section */}
      <div className="h-24 flex items-center px-6 border-b border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent">
        <div className="flex items-center gap-4 relative">
          <div className="relative z-10 flex items-center justify-center w-11 h-11 bg-base-300 border border-white/10 rounded-xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
            <PiLogo size={24} className="relative z-20 text-primary drop-shadow-[0_0_8px_var(--p)]" />
          </div>

          <div className="flex flex-col relative z-10">
            <h2 className="text-[14px] font-black uppercase tracking-[0.1em] text-white leading-tight">
              Pi <span className="text-primary">Admin</span>
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/50">Control Center</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Content */}
      <nav className="flex-1 overflow-y-auto px-3 py-6">
        {nav.map((groupObj, idx) => (
          <NavGroup 
            key={groupObj.group || idx} 
            {...groupObj} 
            onLinkClick={onLinkClick} 
          />
        ))}
      </nav>

      {/* User Footer Section */}
      <AdminUserFooter />
    </div>
  );
}
