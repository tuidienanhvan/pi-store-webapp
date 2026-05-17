import React from "react";

/**
 * KeysPageSkeleton — mirror layout của KeysPage.
 * Header + stat cards + filter bar + key list.
 */
export function KeysPageSkeleton() {
  return (
    <div className="pi-keys-page flex flex-col gap-8" aria-busy="true">
      {/* Page Header */}
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-col gap-3">
          <div className="h-10 w-64 skeleton rounded-2xl" />
          <div className="h-4 w-96 skeleton rounded-lg opacity-40" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-32 skeleton rounded-xl" />
          <div className="h-10 w-40 skeleton rounded-xl" />
        </div>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 rounded-2xl border border-base-content/5 bg-base-200/20 flex flex-col gap-2">
            <div className="h-3 w-20 skeleton" />
            <div className="h-8 w-24 skeleton" />
            <div className="h-2 w-32 skeleton opacity-60" />
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="p-6 rounded-3xl bg-base-200/20 border border-base-content/5 flex flex-col gap-6">
        <div className="h-10 w-full skeleton rounded-xl" />
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-6 border-t border-base-content/5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 w-full skeleton rounded-xl" />
          ))}
        </div>
      </div>

      {/* Key list */}
      <div className="rounded-3xl border border-base-content/5 bg-base-200/20 overflow-hidden">
        <div className="h-14 w-full bg-base-content/5 border-b border-base-content/5" />
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-20 w-full border-b border-base-content/5 flex items-center px-8 gap-8">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-10 h-10 rounded-xl skeleton" />
              <div className="flex flex-col gap-2">
                <div className="h-3 w-40 skeleton" />
                <div className="h-2 w-56 skeleton opacity-60" />
              </div>
            </div>
            <div className="h-5 w-20 skeleton rounded-full" />
            <div className="h-4 w-28 skeleton" />
            <div className="h-8 w-24 skeleton rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default KeysPageSkeleton;
