import React from "react";

export default function FormField({ label, hint, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-base-content/70">
        {label}
        {required && <span className="text-danger ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-base-content/40">{hint}</p>}
    </div>
  );
}
