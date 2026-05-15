import { DashboardLayout } from "../../_shared/components/core/DashboardLayout";
import { 
  Home, 
  Monitor, 
  Key, 
  Download, 
  Zap, 
  CreditCard, 
  Headset, 
  User 
} from "lucide-react";

const USER_NAV = [
  { to: "/app",           label: "Tổng quan",    icon: Home, end: true },
  { to: "/app/usage",     label: "Usage",        icon: Monitor },
  { to: "/app/licenses",  label: "License",      icon: Key },
  { to: "/app/downloads", label: "Tải plugin",   icon: Download },
  { to: "/app/api-keys",  label: "API keys",     icon: Zap },
  { to: "/app/billing",   label: "Thanh toán",   icon: CreditCard },
  { to: "/app/support",   label: "Hỗ trợ",       icon: Headset },
  { to: "/app/profile",   label: "Hồ sơ",        icon: User },
];

export function UserLayout() {
  return <DashboardLayout variant="user" nav={USER_NAV} />;
}

export default UserLayout;
