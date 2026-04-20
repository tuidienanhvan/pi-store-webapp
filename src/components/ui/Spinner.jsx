import React from "react";
import { Icon } from "./icons";

export function Spinner({ size = 16, className = "" }) {
  return (
    <div className={`animate-spin ${className}`} style={{ display: "inline-flex", animation: "spin 1s linear infinite" }}>
      <Icon name="loader" size={size} />
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
