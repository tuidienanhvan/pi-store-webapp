import React, { forwardRef } from "react";

export const Card = forwardRef(({
  as: Component = "article",
  className = "",
  padded = true,
  children,
  ...props
}, ref) => {
  const baseClass = "card";
  const paddedClass = padded ? "card--padded" : "";
  const combinedClass = [baseClass, paddedClass, className].filter(Boolean).join(" ");
  
  return (
    <Component ref={ref} className={combinedClass} {...props}>
      {children}
    </Component>
  );
});

Card.displayName = "Card";
