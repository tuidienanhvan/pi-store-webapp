import React from "react";

/**
 * ProvidersPageSkeleton — mirror layout của ProvidersPage.
 * Header + grid cards (mỗi card = 1 provider với health badge).
 */
export function ProvidersPageSkeleton() {
  return (
    <div className="pi-providers-page flex flex-col gap-8" aria-busy="true">
      {/* Page Header Ghost */}
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-col gap-3">
          <div className="h-10 w-72 skeleton rounded-2xl" />
          <div className="h-4 w-96 skeleton rounded-lg opacity-40" />
        </div>
        <div className="h-10 w-40 skeleton rounded-xl" />
      </div>

      {/* Provider Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="p-6 rounded-3xl border border-base-content/5 bg-base-200/20 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 skeleton rounded-xl" />
                <div className="flex flex-col gap-1.5">
                  <div className="h-4 w-32 skeleton" />
                  <div className="h-3 w-24 skeleton opacity-60" />
                </div>
              </div>
              <div className="h-6 w-16 skeleton rounded-full" />
            </div>
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-base-content/5">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="flex flex-col gap-1.5">
                  <div className="h-2.5 w-16 skeleton" />
                  <div className="h-4 w-20 skeleton" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProvidersPageSkeleton;
