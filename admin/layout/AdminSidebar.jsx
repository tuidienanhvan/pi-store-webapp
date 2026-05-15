import React from "react";
import PiLogo from "@pi-ui/base/PiLogo";
import { NavGroup } from "./NavGroup";
import { AdminUserFooter } from "./AdminUserFooter";

export function AdminSidebar({ nav = [], onLinkClick }) {
  return (
    <div className="flex flex-col h-full bg-base-200/20 border-r border-white/5">
      {/* Brand Section */}
      <div className="h-20 lg:h-24 flex items-center px-6 border-b border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-4 relative">
          <div className="relative z-10 flex items-center justify-center w-10 h-10 bg-base-300 border border-white/10 rounded-xl overflow-hidden group hover:border-primary/50 transition-all duration-500">
            <PiLogo size={20} className="relative z-20 text-primary" />
          </div>

          <div className="flex flex-col relative z-10">
            <h2 className="text-[14px] font-bold tracking-widest text-white leading-tight">
              Pi <span className="text-primary">Quản trị</span>
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1 h-1 rounded-full bg-success" />
              <span className="text-[9px] font-bold tracking-[0.2em] text-primary/60">Hệ thống lõi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Content */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar">
        <div className="flex flex-col gap-6">
          {nav.map((groupObj, idx) => (
            <NavGroup 
              key={groupObj.group || idx} 
              {...groupObj} 
              onLinkClick={onLinkClick} 
            />
          ))}
        </div>
      </nav>

      {/* User Footer Section */}
      <div className="mt-auto border-t border-white/5">
        <AdminUserFooter />
      </div>
    </div>
  );
}
