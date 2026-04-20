import { DashboardLayout } from "../../components/layout/DashboardLayout";

const USER_NAV = [
  { to: "/app",           label: "Tổng quan",    icon: "home", end: true },
  { to: "/app/usage",     label: "Usage",        icon: "monitor" },
  { to: "/app/licenses",  label: "License",      icon: "key" },
  { to: "/app/downloads", label: "Tải plugin",   icon: "download" },
  { to: "/app/api-keys",  label: "API keys",     icon: "zap" },
  { to: "/app/billing",   label: "Thanh toán",   icon: "credit-card" },
  { to: "/app/support",   label: "Hỗ trợ",       icon: "headset" },
  { to: "/app/profile",   label: "Hồ sơ",        icon: "user" },
];

export function UserLayout() {
  return <DashboardLayout variant="user" nav={USER_NAV} />;
}
