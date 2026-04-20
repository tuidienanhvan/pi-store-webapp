import React from "react";
import { Icon } from "./icons";

const ICONS = {
  info: "info",
  success: "success",
  warning: "warning",
  danger: "danger",
};

export function Alert({ tone = "info", title, children, className = "", onDismiss }) {
  return (
    <div className={`alert alert--${tone} ${className}`} role="alert">
      <div style={{ flexShrink: 0, marginTop: "2px", color: `var(--${tone})` }}>
        <Icon name={ICONS[tone] || "info"} size={20} />
      </div>
      <div style={{ flex: 1 }}>
        {title && <h4 style={{ margin: "0 0 4px 0", fontSize: "var(--fs-14)", color: "var(--text-1)" }}>{title}</h4>}
        <div style={{ fontSize: "var(--fs-14)", color: "var(--text-2)" }}>
          {children}
        </div>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-3)", padding: "4px" }}
        >
          <Icon name="x" size={16} />
        </button>
      )}
    </div>
  );
}
