import React from "react";

import { IconButton } from "./Button";
import { Moon, Sun } from "lucide-react";

import { useUiStore } from "@/store/uiStore";



export function ThemeToggle({ className = "" }) {

  const { theme, toggleTheme } = useUiStore();



  return (

    <IconButton 

      icon={theme === "light" ? Moon : Sun} 

      label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}

      onClick={toggleTheme}

      className={className}

    />

  );

}

