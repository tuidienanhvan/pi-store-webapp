import { DashboardLayout } from "@/components/core/DashboardLayout";



const USER_NAV = [

  { to: "/app",           label: "T?ng quan",    icon: "home", end: true },

  { to: "/app/usage",     label: "Usage",        icon: "monitor" },

  { to: "/app/licenses",  label: "License",      icon: "key" },

  { to: "/app/downloads", label: "T?i plugin",   icon: "download" },

  { to: "/app/api-keys",  label: "API keys",     icon: "zap" },

  { to: "/app/billing",   label: "Thanh ton",   icon: "credit-card" },

  { to: "/app/support",   label: "H? tr?",       icon: "headset" },

  { to: "/app/profile",   label: "H? so",        icon: "user" },

];



export function UserLayout() {

  return <DashboardLayout variant="user" nav={USER_NAV} />;

}


export default UserLayout;
