import React from "react";

export function TenantsPageSkeleton() {
  return (
    <div className="pi-tenants-page flex flex-col gap-8" aria-busy="true">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-col gap-3">
          <div className="h-10 w-72 skeleton rounded-2xl" />
          <div className="h-4 w-96 skeleton rounded-lg opacity-40" />
        </div>
        <div className="h-10 w-44 skeleton rounded-xl" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 rounded-3xl skeleton" />
        ))}
      </div>

      <div className="p-6 rounded-3xl bg-base-200/20 border border-base-content/5 flex flex-col md:flex-row gap-3">
        <div className="h-10 flex-1 skeleton rounded-xl" />
        <div className="h-10 w-40 skeleton rounded-xl" />
        <div className="h-10 w-40 skeleton rounded-xl" />
      </div>

      <div className="rounded-3xl border border-base-content/5 bg-base-200/20 overflow-hidden">
        <div className="h-14 w-full bg-base-content/5 border-b border-base-content/5" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-20 w-full border-b border-base-content/5 flex items-center px-8 gap-8">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-9 h-9 rounded-xl skeleton" />
              <div className="flex flex-col gap-2">
                <div className="h-3 w-44 skeleton" />
                <div className="h-2 w-32 skeleton opacity-60" />
              </div>
            </div>
            <div className="h-4 w-32 skeleton" />
            <div className="h-6 w-16 skeleton rounded-full" />
            <div className="h-6 w-20 skeleton rounded-full" />
            <div className="h-4 w-20 skeleton" />
            <div className="h-4 w-24 skeleton" />
            <div className="h-8 w-8 skeleton rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default TenantsPageSkeleton;
