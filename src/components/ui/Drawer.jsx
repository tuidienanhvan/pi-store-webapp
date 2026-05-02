import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { IconButton } from "./Button";
import "./Drawer.css";

export function Drawer({ open, onClose, side = "right", children, title }) {
  const drawerRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && open) onClose();
    };
    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!open) return null;

  const drawerRoot = document.getElementById("drawer-root");
  if (!drawerRoot) return null;

  return createPortal(
    <div className="drawer-backdrop" onClick={handleBackdropClick} role="dialog" aria-modal="true">
      <div ref={drawerRef} className={`drawer drawer--${side}`}>
        {title && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "var(--s-4) var(--s-5)", borderBottom: "1px solid var(--hairline)" }}>
            <h3 style={{ margin: 0, fontSize: "var(--fs-18)" }}>{title}</h3>
            <IconButton icon="x" label="Close drawer" onClick={onClose} size="sm" />
          </div>
        )}
        <div style={{ padding: "var(--s-5)", flex: 1, overflowY: "auto" }}>
          {children}
        </div>
      </div>
    </div>,
    drawerRoot
  );
}
