import React from "react";

export function NavGroupLabel({ label }) {
  return (
    <div className="px-4 mb-2 mt-8 first:mt-2">
      <span className="text-xs font-bold tracking-[0.2em] text-primary/40 whitespace-nowrap">
        {label}
      </span>
    </div>
  );
}
