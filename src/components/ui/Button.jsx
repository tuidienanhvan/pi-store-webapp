import React, { forwardRef } from "react";
import { Link } from "react-router-dom";
import { Icon } from "./icons";
import "./Button.css";

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
  const baseClass = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-transparent font-display font-bold transition-all disabled:pointer-events-none disabled:opacity-60";
  const variantClass = {
    primary: "bg-brand text-white shadow-panel hover:-translate-y-0.5 hover:bg-brand-hover",
    ghost: "border-white/10 bg-white/[0.03] text-text-2 hover:bg-white/[0.07] hover:text-text-1",
    outline: "border-white/15 bg-transparent text-text-1 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[0.05]",
    danger: "bg-danger text-white hover:bg-danger/90",
    link: "h-auto border-0 bg-transparent p-0 text-brand hover:underline",
  }[variant] || "";
  const sizeClass = {
    sm: "h-8 px-3 text-sm",
    md: "h-[42px] px-4 text-sm",
    lg: "h-11 px-6 text-base",
  }[size] || "";
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
  const baseClass = "inline-flex items-center justify-center rounded-lg text-text-2 transition-colors hover:bg-white/[0.07] hover:text-text-1";
  const sizeClass = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-11 w-11",
  }[size] || "h-10 w-10";
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
