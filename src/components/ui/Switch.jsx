import React, { forwardRef, useId } from "react";
import "./Switch.css";

export const Switch = forwardRef(({
  label,
  className = "",
  id,
  ...props
}, ref) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  
  return (
    <div className={className}>
      <label htmlFor={inputId} className="switch-lbl">
        <input
          ref={ref}
          type="checkbox"
          id={inputId}
          {...props}
        />
        {label}
      </label>
    </div>
  );
});

Switch.displayName = "Switch";
