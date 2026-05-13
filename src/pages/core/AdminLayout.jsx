import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Alert, Drawer } from "@/components/ui";
import { 
  LayoutDashboard, 
  Monitor, 
  Zap, 
  CreditCard, 
  Key, 
  Grid, 
  Bolt, 
  Layers, 
  FileText, 
  Settings 
} from "lucide-react";

// Atomic Organisms
import { AdminSidebar } from "@/components/admin/organisms/AdminSidebar";
import { AdminHeader } from "@/components/admin/organisms/AdminHeader";

import "@/components/core/DashboardLayout.css";

//  NAVIGATION CONFIG 
const ADMIN_NAV = [
  {
    group: "General",
    items: [
      { to: "/admin",            label: "Overview",       icon: LayoutDashboard, end: true },
      { to: "/admin/usage",      label: "Usage",          icon: Monitor },
      { to: "/admin/revenue",    label: "Revenue",        icon: Zap },
    ]
  },
  {
    group: "Products & Licenses",
    items: [
      { to: "/admin/packages",   label: "Packages",       icon: CreditCard },
      { to: "/admin/licenses",   label: "Licenses",       icon: Key },
      { to: "/admin/releases",   label: "Plugin Releases",icon: Grid },
    ]
  },
  {
    group: "Infrastructure",
    items: [
      { to: "/admin/providers",  label: "AI Providers",   icon: Bolt },
      { to: "/admin/keys",       label: "Key Pool",       icon: Layers },
    ]
  },
  {
    group: "System",
    items: [
      { to: "/admin/audit-log",  label: "Audit log",      icon: FileText },
      { to: "/admin/settings",   label: "Settings",       icon: Settings },
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
    <div className="dash dash-quantum dash-scanlines" data-variant="admin">
      {/* HUD Decorators */}
      <div className="hud-corner hud-corner--tl" />
      <div className="hud-corner hud-corner--tr" />
      <div className="hud-corner hud-corner--bl" />
      <div className="hud-corner hud-corner--br" />

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
