import { DashboardLayout } from "../../components/layout/DashboardLayout";

const ADMIN_NAV = [
  { to: "/admin",            label: "Tổng quan",      icon: "dashboard", end: true },
  { to: "/admin/licenses",   label: "Licenses",       icon: "key" },
  { to: "/admin/users",      label: "Khách hàng",     icon: "user" },
  { to: "/admin/providers",  label: "AI Providers",   icon: "bolt" },
  { to: "/admin/keys",       label: "Key Pool",       icon: "layers" },
  { to: "/admin/packages",   label: "Packages",       icon: "credit-card" },
  { to: "/admin/usage",      label: "Usage",          icon: "monitor" },
  { to: "/admin/revenue",    label: "Doanh thu",      icon: "zap" },
  { to: "/admin/releases",   label: "Plugin Releases",icon: "grid" },
  { to: "/admin/audit-log",  label: "Audit log",      icon: "file-text" },
  { to: "/admin/settings",   label: "Settings",       icon: "settings" },
];

export function AdminLayout() {
  return <DashboardLayout variant="admin" nav={ADMIN_NAV} />;
}
