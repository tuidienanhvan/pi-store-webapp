import React from "react";
import { NavLink } from "react-router-dom";
import { Circle } from "lucide-react";

/**
 * SidebarLink: Thành phần liên kết trên thanh điều hướng.
 */
export function SidebarLink({ to, label, icon: IconComponent, end, onClick }) {
  const baseClass = "relative flex items-center gap-3.5 rounded-xl px-4 py-3 text-xs font-semibold tracking-widest transition-all duration-300 border mb-1 overflow-hidden group";
  const activeClass = "bg-primary/5 border-primary/20 text-primary";
  const idleClass = "text-base-content/40 border-transparent hover:bg-white/[0.03] hover:text-base-content hover:border-white/10";

  return (
    <NavLink 
      to={to} 
      end={end}
      onClick={onClick}
      className={({ isActive }) => `${baseClass} ${isActive ? activeClass + " active" : idleClass}`}
    >
      {/* Chỉ báo trạng thái hoạt động (Subtle) */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-r-full opacity-0 transition-opacity duration-300 [.active_&]:opacity-100" />
      
      {IconComponent ? (
        <IconComponent size={16} className="transition-transform duration-300 group-hover:scale-110" />
      ) : (
        <Circle size={16} />
      )}
      <span className="truncate">{label}</span>
    </NavLink>
  );
}
