import React from "react";
import { NavLink } from "react-router-dom";
import { Avatar, IconButton, ThemeToggle } from "../ui";
import { Bell, LogOut, Circle } from "lucide-react";
import PiLogo from "@pi-ui/base/PiLogo";
import { useAuth } from "../../context/AuthContext";

const navLinkClass = ({ isActive }) =>
  `flex items-center gap-4 rounded-xl px-5 py-2.5 text-xs font-semibold tracking-wide transition-all duration-300 border ${
    isActive
      ? "bg-primary/15 border-primary/30 text-primary "
      : "text-base-content/60 border-transparent hover:bg-primary/5 hover:text-base-content hover:border-base-border-subtle"
  }`;

export function DashboardSidebar({ variant, nav, setMobileMenuOpen }) {
  const { user, logout } = useAuth();

  const renderIcon = (icon) => {
    if (icon === "logo-optimized") return <PiLogo size={16} />;
    if (typeof icon === "function") {
      const IconComponent = icon;
      return <IconComponent size={16} />;
    }
    return <Circle size={16} />;
  };

  return (
    <>
      {/* Brand */}
      <div className="dash__brand">
        <PiLogo size={28} />
        <span className="text-xs font-semibold text-primary ml-3 tracking-wide px-2.5 py-1 rounded-full border border-primary/20 bg-primary/5">
          - {variant === "admin" ? "Admin" : "My Account"}
        </span>
      </div>

      {/* Nav */}
      <nav className="dash__nav">
        {nav.map((groupObj, idx) => {
          if (!groupObj.group) {
            const item = groupObj;
            return (
              <NavLink key={item.to} to={item.to} end={item.end}
                onClick={() => setMobileMenuOpen?.(false)}
                className={navLinkClass}>
                {renderIcon(item.icon)}
                {item.label}
              </NavLink>
            );
          }

          return (
            <div key={groupObj.group || idx} className="flex flex-col gap-1 mt-4 first:mt-0">
              <div className="text-xs font-semibold tracking-wide text-base-content/60 opacity-40 px-5 mb-2">
                {groupObj.group}
              </div>
              <div className="flex flex-col gap-1">
                {groupObj.items.map((item) => (
                  <NavLink key={item.to} to={item.to} end={item.end}
                    onClick={() => setMobileMenuOpen?.(false)}
                    className={navLinkClass}>
                    {renderIcon(item.icon)}
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="dash__user-footer">
        <div className="flex flex-col gap-4 w-full">
          <div className="flex items-center justify-between px-1 mb-2">
            <ThemeToggle />
            <IconButton icon={Bell} label="Notifications" variant="ghost" size="sm" />
          </div>
          <div className="flex items-center gap-3">
            <Avatar name={user?.name || user?.email || "G"} size="sm" />
            <div className="flex flex-col gap-0.5 min-w-0 flex-1">
              <div className="text-xs font-semibold text-base-content truncate tracking-wide">
                {user?.name || user?.email || "Guest"}
              </div>
              <div className="text-xs font-semibold tracking-wide text-base-content/60 opacity-40 truncate">
                {variant === "admin" ? "Administrator" : "Member"}
              </div>
            </div>
            <IconButton icon={LogOut} label="Sign out" onClick={logout} variant="ghost" size="sm" />
          </div>
        </div>
      </div>
    </>
  );
}
