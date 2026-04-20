import React, { useEffect, useState } from "react";
import { IconButton } from "./Button";

export function ThemeToggle({ className = "" }) {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Check initial theme from html tag (set by blocking script in head)
    const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
    setTheme(currentTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    try {
      localStorage.setItem("pi_theme", newTheme);
    } catch(e) {}
  };

  return (
    <IconButton 
      icon={theme === "light" ? "moon" : "sun"} 
      label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      onClick={toggleTheme}
      className={className}
    />
  );
}
