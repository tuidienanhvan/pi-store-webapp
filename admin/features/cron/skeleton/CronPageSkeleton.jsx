import React from "react";

/**
 * CronPageSkeleton — mirror layout của CronPage.
 * Header + grid of cron job cards (mỗi card có status + last_run + schedule).
 */
export function CronPageSkeleton() {
  return (
    <div className="pi-cron-page flex flex-col gap-8" aria-busy="true">
      {/* Page Header */}
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-col gap-3">
          <div className="h-10 w-64 skeleton rounded-2xl" />
          <div className="h-4 w-96 skeleton rounded-lg opacity-40" />
        </div>
        <div className="h-10 w-32 skeleton rounded-xl" />
      </div>

      {/* Cron Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="p-6 rounded-3xl border border-base-content/5 bg-base-200/20 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 skeleton rounded-xl" />
                <div className="flex flex-col gap-1.5">
                  <div className="h-4 w-32 skeleton" />
                  <div className="h-3 w-20 skeleton opacity-60" />
                </div>
              </div>
              <div className="h-6 w-16 skeleton rounded-full" />
            </div>

            <div className="flex flex-col gap-2 pt-4 border-t border-base-content/5">
              <div className="flex justify-between">
                <div className="h-3 w-20 skeleton" />
                <div className="h-3 w-24 skeleton" />
              </div>
              <div className="flex justify-between">
                <div className="h-3 w-20 skeleton" />
                <div className="h-3 w-24 skeleton" />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <div className="h-9 w-20 skeleton rounded-xl" />
              <div className="h-9 w-20 skeleton rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CronPageSkeleton;
