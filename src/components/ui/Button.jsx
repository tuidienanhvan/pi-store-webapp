import React, { forwardRef } from "react";
import { Link } from "react-router-dom";
import { Icon } from "./icons";

export const Button = forwardRef(({
  children,
  variant = "primary",
  size = "md",
  as: Component = "button",
  className = "",
  disabled,
  isLoading,
  ...props
}, ref) => {
  const baseClass = "btn";
  const variantClass = `btn--${variant}`;
  const sizeClass = size ? `btn--${size}` : "";
  const combinedClass = [baseClass, variantClass, sizeClass, className].filter(Boolean).join(" ");

  // If using router Link, Component will be string "Link" or Link component
  const Element = Component === "Link" ? Link : Component;

  return (
    <Element
      ref={ref}
      className={combinedClass}
      disabled={disabled || isLoading}
      aria-disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Icon name="loader" className="animate-spin" />}
      {!isLoading && children}
    </Element>
  );
});

Button.displayName = "Button";

export const IconButton = forwardRef(({
  icon,
  label,
  variant = "ghost",
  size = "md",
  className = "",
  ...props
}, ref) => {
  const baseClass = "icon-btn";
  const sizeClass = `icon-btn--${size}`;
  // We can reuse Button variants if needed or stick strictly to icon-btn
  const combinedClass = [baseClass, sizeClass, className].filter(Boolean).join(" ");
  
  return (
    <button
      ref={ref}
      type="button"
      className={combinedClass}
      aria-label={label}
      title={label}
      {...props}
    >
      <Icon name={icon} size={size === "sm" ? 16 : 20} />
    </button>
  );
});

IconButton.displayName = "IconButton";
