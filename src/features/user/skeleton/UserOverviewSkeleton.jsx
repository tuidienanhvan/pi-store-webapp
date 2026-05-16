import React from "react";

/**
 * UserOverviewSkeleton — mirror layout của UserOverviewPage.
 * Package banner + stat grid.
 */
export function UserOverviewSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true">
      {/* Package banner */}
      <div className="p-6 rounded-3xl border border-base-content/5 bg-base-200/20 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <div className="h-3 w-32 skeleton opacity-60" />
            <div className="h-7 w-48 skeleton" />
          </div>
          <div className="h-8 w-20 skeleton rounded-full" />
        </div>
        <div className="h-2 w-full skeleton rounded-full" />
        <div className="flex justify-between">
          <div className="h-3 w-20 skeleton opacity-60" />
          <div className="h-3 w-32 skeleton opacity-60" />
        </div>
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-5 rounded-2xl border border-base-content/5 bg-base-200/20 flex flex-col gap-2">
            <div className="h-3 w-20 skeleton opacity-60" />
            <div className="h-8 w-28 skeleton" />
            <div className="h-2 w-24 skeleton opacity-50" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserOverviewSkeleton;
