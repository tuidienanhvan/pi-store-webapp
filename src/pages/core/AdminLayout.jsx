import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Alert, Drawer } from "@/components/ui";

// Atomic Organisms
import { AdminSidebar } from "@/components/admin/organisms/AdminSidebar";
import { AdminHeader } from "@/components/admin/organisms/AdminHeader";

import "@/components/core/DashboardLayout.css";

//  NAVIGATION CONFIG 
const ADMIN_NAV = [
  {
    group: "General",
    items: [
      { to: "/admin",            label: "Overview",       icon: "dashboard", end: true },
      { to: "/admin/usage",      label: "Usage",          icon: "monitor" },
      { to: "/admin/revenue",    label: "Revenue",        icon: "zap" },
    ]
  },
  {
    group: "Products & Licenses",
    items: [
      { to: "/admin/packages",   label: "Packages",       icon: "credit-card" },
      { to: "/admin/licenses",   label: "Licenses",       icon: "key" },
      { to: "/admin/releases",   label: "Plugin Releases",icon: "grid" },
    ]
  },
  {
    group: "Infrastructure",
    items: [
      { to: "/admin/providers",  label: "AI Providers",   icon: "bolt" },
      { to: "/admin/keys",       label: "Key Pool",       icon: "layers" },
    ]
  },
  {
    group: "System",
    items: [
      { to: "/admin/audit-log",  label: "Audit log",      icon: "file-text" },
      { to: "/admin/settings",   label: "Settings",       icon: "settings" },
    ]
  }
];

/**
 * AdminLayout Template: Assembles Atomic components into the final Admin UI.
 */
export function AdminLayout() {
  const { MOCK_MODE } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Find current page title
  const currentTitle = ADMIN_NAV.flatMap(g => g.items)
    .find(i => i.to === location.pathname || (location.pathname.startsWith(i.to) && i.to !== "/admin"))
    ?.label || "Dashboard";

  return (
    <div className="dash" data-variant="admin">
      {/* Sidebar - Desktop */}
      <aside className="dash__sidebar glass">
        <AdminSidebar nav={ADMIN_NAV} />
      </aside>

      {/* Sidebar - Mobile Drawer */}
      <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)} side="left" title="Menu">
        <div className="h-full bg-base-200">
          <AdminSidebar nav={ADMIN_NAV} onLinkClick={() => setMobileOpen(false)} />
        </div>
      </Drawer>

      <main className="dash__main">
        {/* Header Organism */}
        <AdminHeader title={currentTitle} onMenuClick={() => setMobileOpen(true)} />

        {/* System Alerts */}
        {MOCK_MODE && (
          <div className="mx-auto w-full max-w-[1400px] px-12 mt-6">
            <Alert tone="warning" className="rounded-2xl border-warning/20 bg-warning/5">
              Backend not connected. Mock mode is active.
            </Alert>
          </div>
        )}

        {/* Page Content */}
        <div className="mx-auto w-full max-w-[1400px] px-12 py-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
export default AdminLayout;
