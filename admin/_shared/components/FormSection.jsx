import React from "react";
import { AdminCard } from "./AdminCard";

export default function FormSection({ title, description, icon: Icon, children }) {
  return (
    <AdminCard className="p-6 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        {Icon && <Icon size={16} className="text-primary/70" />}
        <div>
          <h3 className="text-sm font-semibold text-base-content">{title}</h3>
          {description && (
            <p className="text-xs text-base-content/50 mt-0.5">{description}</p>
          )}
        </div>
      </div>
      {children}
    </AdminCard>
  );
}
