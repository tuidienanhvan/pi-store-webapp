import React from "react";
import "./Skeleton.css";

export function Skeleton({ width, height, variant = "rect", className = "", style = {} }) {
  const baseStyle = {
    backgroundColor: "var(--surface-3)",
    animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
    width: width || "100%",
    height: height || "1rem",
    borderRadius: variant === "circle" ? "9999px" : variant === "text" ? "var(--r-1)" : "var(--r-2)",
    ...style
  };

  return (
    <div className={className} style={baseStyle}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
      `}</style>
    </div>
  );
}
