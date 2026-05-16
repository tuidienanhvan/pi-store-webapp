import React from "react";

/**
 * ReleasesPageSkeleton — mirror layout của ReleasesPage.
 * Header + table releases (version, file, date, actions).
 */
export function ReleasesPageSkeleton() {
  return (
    <div className="pi-releases-page flex flex-col gap-8" aria-busy="true">
      {/* Page Header */}
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-col gap-3">
          <div className="h-10 w-72 skeleton rounded-2xl" />
          <div className="h-4 w-96 skeleton rounded-lg opacity-40" />
        </div>
        <div className="h-10 w-40 skeleton rounded-xl" />
      </div>

      {/* Releases Table */}
      <div className="rounded-3xl border border-base-content/5 bg-base-200/20 overflow-hidden">
        <div className="h-14 w-full bg-base-content/5 border-b border-base-content/5" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-24 w-full border-b border-base-content/5 flex items-center px-8 gap-8">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 rounded-2xl skeleton" />
              <div className="flex flex-col gap-2">
                <div className="h-4 w-32 skeleton" />
                <div className="h-3 w-48 skeleton opacity-60" />
              </div>
            </div>
            <div className="h-5 w-28 skeleton" />
            <div className="h-5 w-24 skeleton" />
            <div className="h-6 w-20 skeleton rounded-full" />
            <div className="h-8 w-24 skeleton rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReleasesPageSkeleton;
