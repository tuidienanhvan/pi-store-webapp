import React from "react";

/**
 * PackagesPageSkeleton — mirror layout của PackagesPage.
 * Header + table với rows (icon + tên gói + price + actions).
 */
export function PackagesPageSkeleton() {
  return (
    <div className="pi-packages-page flex flex-col gap-8" aria-busy="true">
      {/* Page Header Ghost */}
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-col gap-3">
          <div className="h-10 w-64 skeleton rounded-2xl" />
          <div className="h-4 w-96 skeleton rounded-lg opacity-40" />
        </div>
        <div className="h-10 w-36 skeleton rounded-xl" />
      </div>

      {/* Table Ghost */}
      <div className="rounded-3xl border border-base-content/5 bg-base-200/20 overflow-hidden">
        <div className="h-14 w-full bg-base-content/5 border-b border-base-content/5" />
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-24 w-full border-b border-base-content/5 flex items-center px-8 gap-8">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-14 h-14 rounded-2xl skeleton" />
              <div className="flex flex-col gap-2">
                <div className="h-4 w-48 skeleton" />
                <div className="h-3 w-64 skeleton opacity-60" />
              </div>
            </div>
            <div className="h-5 w-24 skeleton" />
            <div className="h-5 w-20 skeleton" />
            <div className="h-6 w-20 skeleton rounded-full" />
            <div className="flex gap-2">
              <div className="w-9 h-9 skeleton rounded-xl" />
              <div className="w-9 h-9 skeleton rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PackagesPageSkeleton;
