import React, { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Alert, Avatar, Drawer, Icon, IconButton, ThemeToggle } from "../ui";
import "./DashboardLayout.css";

export function DashboardLayout({ variant = "user", nav = [] }) {
  const { user, logout, mockMode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const currentRouteName =
    nav.find((n) => n.to === location.pathname || (location.pathname.startsWith(n.to) && n.to !== "/admin" && n.to !== "/app"))?.label ||
    "Dashboard";

  const SidebarContent = () => (
    <>
      <div className="dash__brand dash__brand-shell">
        <img src="/logo-optimized.svg?v=20260417-1" alt="Pi" className="dash__brand-logo" />
        <span className="dash__brand-sub">- {variant === "admin" ? "Admin" : "My Account"}</span>
      </div>

      <nav className="dash__nav">
        {nav.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => (isActive ? "active" : "")}>
            {item.icon === "logo-optimized" ? <img src="/logo-optimized.svg?v=20260417-1" alt="Pi" className="dash__nav-logo" /> : <Icon name={item.icon || "circle"} size={16} />}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="dash__user">
        <Avatar name={user?.name || user?.email || "G"} size="sm" />
        <div className="dash__user-info">
          <div className="dash__user-name">{user?.name || user?.email || "Guest"}</div>
          <div className="dash__user-email">{variant === "admin" ? "Administrator" : "Member"}</div>
        </div>
        <IconButton icon="logout" label="Sign out" onClick={handleLogout} variant="ghost" size="sm" />
      </div>
    </>
  );

  return (
    <div className="dash" data-variant={variant}>
      <aside className="dash__sidebar glass">
        <SidebarContent />
      </aside>

      <Drawer open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} side="left" title="Menu">
        <div className="dash__drawer-shell">
          <SidebarContent />
        </div>
      </Drawer>

      <main className="dash__main">
        {mockMode && (
          <Alert tone="warning" title="MOCK MODE ACTIVE" className="dash__mock-alert">
            Backend not connected. Disable with <code>VITE_MOCK_AUTH=0</code> in <code>.env</code>.
          </Alert>
        )}

        <header className="dash__topbar glass">
          <div className="row">
            <IconButton icon="menu" className="dash__burger" label="Menu" onClick={() => setMobileMenuOpen(true)} variant="ghost" />
            <div className="dash__crumbs">{currentRouteName}</div>
          </div>

          <div className="dash__topbar-tools">
            <ThemeToggle />
            <IconButton icon="bell" label="Notifications" variant="ghost" />
          </div>
        </header>

        <div className="dash__content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
