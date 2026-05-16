import React from "react";

/**
 * LicenseDetailSkeleton — ghost cho trang chi tiết license.
 * Header + 2-cột (main info + sidebar metadata).
 */
export function LicenseDetailSkeleton() {
  return (
    <div className="pi-license-detail flex flex-col gap-8" aria-busy="true">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-col gap-3">
          <div className="h-4 w-32 skeleton" />
          <div className="h-10 w-72 skeleton rounded-2xl" />
          <div className="h-4 w-96 skeleton rounded-lg opacity-40" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-28 skeleton rounded-xl" />
          <div className="h-10 w-28 skeleton rounded-xl" />
        </div>
      </div>

      {/* 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="p-8 rounded-3xl border border-base-content/5 bg-base-200/20 flex flex-col gap-4">
            <div className="h-5 w-40 skeleton" />
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="h-3 w-24 skeleton" />
                  <div className="h-6 w-32 skeleton" />
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 rounded-3xl border border-base-content/5 bg-base-200/20 flex flex-col gap-4">
            <div className="h-5 w-48 skeleton" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 w-full skeleton rounded-xl" />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          <div className="p-6 rounded-3xl border border-base-content/5 bg-base-200/20 flex flex-col gap-3">
            <div className="h-4 w-32 skeleton" />
            <div className="h-8 w-40 skeleton" />
            <div className="h-2 w-full skeleton rounded-full" />
          </div>
          <div className="p-6 rounded-3xl border border-base-content/5 bg-base-200/20 flex flex-col gap-3">
            <div className="h-4 w-32 skeleton" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between">
                <div className="h-3 w-20 skeleton" />
                <div className="h-3 w-16 skeleton" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LicenseDetailSkeleton;
