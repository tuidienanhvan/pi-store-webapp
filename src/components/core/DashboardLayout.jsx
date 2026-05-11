import React, { useState } from "react";

import { Outlet, useLocation } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";

import { Alert, Drawer } from "../ui";

import { DashboardSidebar } from "./DashboardSidebar";

import { DashboardHeader } from "./DashboardHeader";

import "./DashboardLayout.css";



export function DashboardLayout({ variant = "user", nav = [], SidebarComponent = DashboardSidebar }) {

  const { mockMode } = useAuth();

  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);



  // Helper to find current route name even if nav is grouped

  const findCurrentRouteName = () => {

    for (const itemOrGroup of nav) {

      if (itemOrGroup.group) {

        const found = itemOrGroup.items.find((n) => n.to === location.pathname || (location.pathname.startsWith(n.to) && n.to !== "/admin" && n.to !== "/app"));

        if (found) return found.label;

      } else {

        if (itemOrGroup.to === location.pathname || (location.pathname.startsWith(itemOrGroup.to) && itemOrGroup.to !== "/admin" && itemOrGroup.to !== "/app")) {

          return itemOrGroup.label;

        }

      }

    }

    return "Dashboard";

  };



  const currentRouteName = findCurrentRouteName();



  return (

    <div className="dash" data-variant={variant}>

      <aside className="dash__sidebar glass">

        <SidebarComponent variant={variant} nav={nav} setMobileMenuOpen={setMobileMenuOpen} />

      </aside>



      <Drawer open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} side="left" title="Menu">

        <div className="dash__drawer-shell">

          <SidebarComponent variant={variant} nav={nav} setMobileMenuOpen={setMobileMenuOpen} />

        </div>

      </Drawer>



      <main className="dash__main">

        <DashboardHeader currentRouteName={currentRouteName} setMobileMenuOpen={setMobileMenuOpen} />



        {mockMode && (

          <Alert tone="warning" title="MOCK MODE ACTIVE" className="dash__mock-alert">

            Backend not connected. Disable with <code>VITE_MOCK_AUTH=0</code> in <code>.env</code>.

          </Alert>

        )}



        <div className="dash__content">

          <Outlet />

        </div>

      </main>

    </div>

  );

}

