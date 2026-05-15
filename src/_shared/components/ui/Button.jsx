import React, { forwardRef } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import "./Button.css";

export const Button = forwardRef(({
  children,
  variant = "primary",
  size = "md",
  as: Component = "button",
  className = "",
  disabled,
  isLoading,
  fullWidth,
  ...props
}, ref) => {
  const baseClass = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-transparent font-display font-bold transition-all disabled:pointer-events-none disabled:opacity-60";

  const variantClass = {
    primary: "bg-primary text-primary-content shadow-md.5 hover:bg-primary-hover",
    ghost: "border-base-border bg-base-content/[0.03] text-slate-400 hover:bg-base-content/[0.07] hover:text-base-content",
    outline: "border-base-border bg-transparent text-base-content.5 hover:border-primary/30 hover:bg-base-content/[0.05]",
    danger: "bg-danger text-base-content hover:bg-danger/90",
    link: "h-auto border-0 bg-transparent p-0 text-primary hover:underline",
  }[variant] || "";

  const sizeClass = {
    sm: "h-8 px-3 text-sm",
    md: "h-[42px] px-4 text-sm",
    lg: "h-11 px-6 text-base",
  }[size] || "";

  const fullWidthClass = fullWidth ? "w-full" : "";

  const combinedClass = [baseClass, variantClass, sizeClass, fullWidthClass, className].filter(Boolean).join(" ");

  const Element = Component === "Link" ? Link : Component;

  return (
    <Element
      ref={ref}
      className={combinedClass}
      disabled={disabled || isLoading}
      aria-disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="animate-spin" size={16} />}
      {!isLoading && children}
    </Element>
  );
});

Button.displayName = "Button";

export const IconButton = forwardRef(({
  icon: IconComponent,
  label,
  size = "md",
  className = "",
  iconSize,
  ...props
}, ref) => {
  const baseClass = "inline-flex items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-base-content/[0.05] hover:text-base-content";

  const sizeClass = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-11 w-11",
  }[size] || "h-10 w-10";

  const combinedClass = [baseClass, sizeClass, className].filter(Boolean).join(" ");

  const finalIconSize = iconSize || (size === "sm" ? 16 : 20);

  return (
    <button
      ref={ref}
      type="button"
      className={combinedClass}
      aria-label={label}
      title={label}
      {...props}
    >
      {IconComponent && <IconComponent size={finalIconSize} />}
    </button>
  );
});

IconButton.displayName = "IconButton";
