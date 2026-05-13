import React from "react";
import PiLogo from "@pi-ui/base/PiLogo";
import { NavGroup } from "../molecules/NavGroup";
import { AdminUserFooter } from "../molecules/AdminUserFooter";

export function AdminSidebar({ nav = [], onLinkClick }) {
  return (
    <div className="flex flex-col h-full bg-base-200/20">
      {/* Brand Section */}
      <div className="h-20 flex items-center px-6 border-b border-base-border-subtle bg-base-300/10">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-primary/10 rounded-lg border border-primary/20">
            <PiLogo size={22} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[12px] font-black uppercase tracking-widest text-base-content">Pi Admin</span>
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-primary mt-0.5">Control Center</span>
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
