import React from "react";
import { Icon } from "./icons";
import "./Badge.css";

export function Badge({ children, tone = "neutral", className = "", icon }) {
  const toneClass = {
    neutral: "bg-white/[0.06] text-text-2",
    brand: "border border-brand/25 bg-brand/15 text-brand",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    danger: "bg-danger/10 text-danger",
    info: "bg-info/10 text-info",
  }[tone] || "bg-white/[0.06] text-text-2";

  return (
    <span className={`inline-flex w-fit items-center gap-1 rounded-full px-2 py-1 text-xs font-extrabold tracking-wide ${toneClass} ${className}`}>
      {icon && <Icon name={icon} size={12} />}
      {children}
    </span>
  );
}
