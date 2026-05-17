import React from "react";

export function TenantDetailSkeleton() {
  return (
    <div className="pi-tenant-detail flex flex-col gap-8" aria-busy="true">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-col gap-3">
          <div className="h-10 w-64 skeleton rounded-2xl" />
          <div className="h-4 w-80 skeleton rounded-lg opacity-40" />
        </div>
        <div className="h-10 w-32 skeleton rounded-xl" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 rounded-3xl skeleton" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="p-6 rounded-3xl skeleton h-80" />
        ))}
      </div>

      <div className="p-6 rounded-3xl skeleton h-48" />
    </div>
  );
}

export default TenantDetailSkeleton;
