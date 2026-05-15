import React from "react";

import { IconButton, ThemeToggle } from "../ui";
import { Menu } from "lucide-react";


export function DashboardHeader({ currentRouteName, setMobileMenuOpen }) {

  return (

    <header className="dash__mobile-header">

      <IconButton icon={Menu} label="Menu" onClick={() => setMobileMenuOpen(true)} variant="ghost" />

      <div className="text-xs font-semibold tracking-wide text-primary">{currentRouteName}</div>

      <div className="flex items-center gap-2">

        <ThemeToggle />

      </div>

    </header>

  );

}

