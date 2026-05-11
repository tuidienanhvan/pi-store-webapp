import React from "react";

import { IconButton, ThemeToggle } from "../ui";



export function DashboardHeader({ currentRouteName, setMobileMenuOpen }) {

  return (

    <header className="dash__mobile-header">

      <IconButton icon="menu" label="Menu" onClick={() => setMobileMenuOpen(true)} variant="ghost" />

      <div className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">{currentRouteName}</div>

      <div className="flex items-center gap-2">

        <ThemeToggle />

      </div>

    </header>

  );

}

