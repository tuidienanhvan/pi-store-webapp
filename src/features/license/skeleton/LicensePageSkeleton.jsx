import React from "react";

/**
 * LicensePageSkeleton — mirror layout của LicensePage.
 * Header + license info card với grid 3 cột.
 */
export function LicensePageSkeleton() {
  return (
    <div className="flex flex-col gap-8" aria-busy="true">
      <header className="flex flex-col gap-2">
        <div className="h-9 w-56 skeleton rounded-xl" />
        <div className="h-4 w-96 skeleton opacity-50" />
      </header>

      <div className="rounded-3xl border border-base-content/5 bg-base-200/20 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-base-content/5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-6 bg-base-200 flex flex-col gap-2">
              <div className="h-3 w-24 skeleton opacity-60" />
              <div className="h-6 w-32 skeleton" />
            </div>
          ))}
        </div>
      </div>

      <div className="p-8 rounded-3xl border border-base-content/5 bg-base-200/20 flex flex-col gap-4">
        <div className="h-4 w-32 skeleton" />
        <div className="h-11 w-full skeleton rounded-xl" />
        <div className="h-3 w-72 skeleton opacity-50" />
      </div>
    </div>
  );
}

export default LicensePageSkeleton;
