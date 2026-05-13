import React from "react";
import { NavLink } from "react-router-dom";
import { Circle } from "lucide-react";

export function SidebarLink({ to, label, icon: IconComponent, end, onClick }) {
  const baseClass = "relative flex items-center gap-3.5 rounded-xl px-4 py-3 text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300 border mb-2 overflow-hidden group";
  const activeClass = "bg-primary/10 border-primary/20 text-primary shadow-[inset_0_0_20px_rgba(var(--p-rgb),0.05)]";
  const idleClass = "text-base-content/40 border-transparent hover:translate-x-1 hover:bg-white/[0.03] hover:text-base-content hover:border-white/10";

  return (
    <NavLink 
      to={to} 
      end={end}
      onClick={onClick}
      className={({ isActive }) => `${baseClass} ${isActive ? activeClass + " active" : idleClass}`}
    >
      {/* Active Indicator Glow */}
      <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-r-full scale-y-0 transition-transform duration-300 origin-center [.active_&]:scale-y-100 shadow-[0_0_10px_var(--p)]" />
      
      {IconComponent ? (
        <IconComponent size={18} className="transition-transform duration-300 group-hover:scale-110 group-active:scale-95" />
      ) : (
        <Circle size={18} />
      )}
      <span className="truncate tracking-widest">{label}</span>
    </NavLink>
  );
}
