import React, { forwardRef, useId } from "react";
import { Icon } from "./icons";

export const Input = forwardRef(({
  label,
  hint,
  error,
  leadingIcon,
  className = "",
  id,
  style,          // ← extracted so it doesn't override paddingLeft on <input>
  inputStyle,     // optional: styles specifically for the <input> element
  ...props
}, ref) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const isInvalid = Boolean(error);

  // Merge: padding-left from icon + any caller-supplied inputStyle
  const resolvedInputStyle = {
    ...(leadingIcon ? { paddingLeft: "40px" } : {}),
    ...inputStyle,
  };

  return (
    <div className={`form-group ${className}`} style={style}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
        </label>
      )}
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        {leadingIcon && (
          <div style={{ position: "absolute", left: "12px", color: "var(--text-3)", display: "flex", pointerEvents: "none" }}>
            <Icon name={leadingIcon} size={15} />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className="input"
          style={resolvedInputStyle}
          aria-invalid={isInvalid}
          aria-describedby={
            isInvalid ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          {...props}
        />
      </div>
      {hint && !isInvalid && (
        <div id={`${inputId}-hint`} className="form-hint">
          {hint}
        </div>
      )}
      {isInvalid && error && (
        <div id={`${inputId}-error`} className="form-error">
          {error}
        </div>
      )}
    </div>
  );
});

Input.displayName = "Input";
