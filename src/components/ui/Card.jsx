import React, { forwardRef } from "react";
import "./Card.css";

export const Card = forwardRef(({
  as: Component = "article",
  className = "",
  padded = true,
  children,
  ...props
}, ref) => {
  const baseClass = "overflow-hidden rounded-card border border-white/10 bg-white/[0.035] shadow-panel transition-all";
  const paddedClass = padded ? "p-6" : "";
  const combinedClass = [baseClass, paddedClass, className].filter(Boolean).join(" ");
  
  return (
    <Component ref={ref} className={combinedClass} {...props}>
      {children}
    </Component>
  );
});

Card.displayName = "Card";
