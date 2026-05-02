import React from "react";
import { Icon } from "./icons";
import "./Alert.css";

const ICONS = {
  info: "info",
  success: "success",
  warning: "warning",
  danger: "danger",
};

export function Alert({ tone = "info", title, children, className = "", onDismiss }) {
  const toneClass = {
    info: "border-info/20 bg-info/10",
    success: "border-success/20 bg-success/10",
    warning: "border-warning/20 bg-warning/10",
    danger: "border-danger/20 bg-danger/10",
  }[tone] || "border-info/20 bg-info/10";
  const iconToneClass = {
    info: "text-info",
    success: "text-success",
    warning: "text-warning",
    danger: "text-danger",
  }[tone] || "text-info";

  return (
    <div className={`flex items-start gap-3 rounded-lg border p-4 ${toneClass} ${className}`} role="alert">
      <div className={`mt-0.5 shrink-0 ${iconToneClass}`}>
        <Icon name={ICONS[tone] || "info"} size={20} />
      </div>
      <div className="flex-1">
        {title && <h4 className="mb-1 text-sm text-text-1">{title}</h4>}
        <div className="text-sm text-text-2">
          {children}
        </div>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="rounded p-1 text-text-3 transition hover:bg-white/10 hover:text-text-1"
          aria-label="Dismiss"
        >
          <Icon name="x" size={16} />
        </button>
      )}
    </div>
  );
}
