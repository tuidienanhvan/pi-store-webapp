import React from "react";
import { NavLink } from "react-router-dom";
import { Icon } from "../../ui";

export function SidebarLink({ to, label, icon, end, onClick }) {
  const baseClass = "flex items-center gap-3.5 rounded-xl px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300 border mb-1";
  const activeClass = "bg-primary/10 border-primary/20 text-primary shadow-sm";
  const idleClass = "text-base-content/60 border-transparent hover:translate-x-1 hover:bg-base-content/5 hover:text-base-content hover:border-base-border-subtle";

  return (
    <NavLink 
      to={to} 
      end={end}
      onClick={onClick}
      className={({ isActive }) => `${baseClass} ${isActive ? activeClass : idleClass}`}
    >
      <Icon name={icon || "circle"} size={16} className="opacity-80" />
      <span className="truncate">{label}</span>
    </NavLink>
  );
}