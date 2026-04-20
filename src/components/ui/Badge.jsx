import React from "react";
import { Icon } from "./icons";

export function Badge({ children, tone = "neutral", className = "", icon }) {
  return (
    <span className={`badge badge--${tone} ${className}`}>
      {icon && <Icon name={icon} size={12} />}
      {children}
    </span>
  );
}
