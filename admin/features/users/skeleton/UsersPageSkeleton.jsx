import React from "react";

/**
 * UsersPageSkeleton — mirror layout của UsersPage.
 * Header + filter + table users (avatar + email + tier + tokens + actions).
 */
export function UsersPageSkeleton() {
  return (
    <div className="pi-users-page flex flex-col gap-8" aria-busy="true">
      {/* Page Header */}
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-col gap-3">
          <div className="h-10 w-64 skeleton rounded-2xl" />
          <div className="h-4 w-96 skeleton rounded-lg opacity-40" />
        </div>
        <div className="h-10 w-36 skeleton rounded-xl" />
      </div>

      {/* Filter Bar */}
      <div className="p-6 rounded-3xl bg-base-200/20 border border-base-content/5 flex flex-col gap-6">
        <div className="h-10 w-full skeleton rounded-xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 border-t border-base-content/5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 w-full skeleton rounded-xl" />
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-3xl border border-base-content/5 bg-base-200/20 overflow-hidden">
        <div className="h-14 w-full bg-base-content/5 border-b border-base-content/5" />
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="h-20 w-full border-b border-base-content/5 flex items-center px-8 gap-8">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-11 h-11 rounded-full skeleton" />
              <div className="flex flex-col gap-2">
                <div className="h-3 w-48 skeleton" />
                <div className="h-2 w-32 skeleton opacity-60" />
              </div>
            </div>
            <div className="h-6 w-20 skeleton rounded-full" />
            <div className="h-4 w-24 skeleton" />
            <div className="h-4 w-20 skeleton" />
            <div className="h-8 w-24 skeleton rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default UsersPageSkeleton;
