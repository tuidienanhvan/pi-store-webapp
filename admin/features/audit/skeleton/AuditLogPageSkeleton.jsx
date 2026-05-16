import React from "react";

/**
 * AuditLogPageSkeleton — mirror layout của AuditLogPage.
 * Header + filter + timeline of audit events.
 */
export function AuditLogPageSkeleton() {
  return (
    <div className="pi-audit-log-page flex flex-col gap-8" aria-busy="true">
      {/* Page Header */}
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-col gap-3">
          <div className="h-10 w-72 skeleton rounded-2xl" />
          <div className="h-4 w-96 skeleton rounded-lg opacity-40" />
        </div>
        <div className="h-10 w-32 skeleton rounded-xl" />
      </div>

      {/* Filter */}
      <div className="p-6 rounded-3xl bg-base-200/20 border border-base-content/5 flex flex-col gap-6">
        <div className="h-10 w-full skeleton rounded-xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 border-t border-base-content/5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 w-full skeleton rounded-xl" />
          ))}
        </div>
      </div>

      {/* Audit Timeline */}
      <div className="rounded-3xl border border-base-content/5 bg-base-200/20 overflow-hidden">
        <div className="h-14 w-full bg-base-content/5 border-b border-base-content/5" />
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="h-16 w-full border-b border-base-content/5 flex items-center px-8 gap-8">
            <div className="w-8 h-8 rounded-xl skeleton" />
            <div className="flex flex-col gap-1.5 flex-1">
              <div className="h-3 w-64 skeleton" />
              <div className="h-2 w-40 skeleton opacity-60" />
            </div>
            <div className="h-5 w-20 skeleton rounded-full" />
            <div className="h-3 w-24 skeleton" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default AuditLogPageSkeleton;
