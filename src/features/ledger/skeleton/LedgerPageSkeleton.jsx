import React from "react";

/**
 * LedgerPageSkeleton — mirror layout của LedgerPage.
 * Header + transaction table (op | amount | timestamp).
 */
export function LedgerPageSkeleton() {
  return (
    <div className="ledger-container flex flex-col gap-6" aria-busy="true">
      <header className="flex flex-col gap-2">
        <div className="h-9 w-64 skeleton rounded-xl" />
        <div className="h-4 w-96 skeleton opacity-50" />
      </header>

      <div className="rounded-3xl border border-base-content/5 bg-base-200/20 overflow-hidden">
        <div className="h-12 w-full bg-base-content/5 border-b border-base-content/5" />
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="h-16 w-full border-b border-base-content/5 flex items-center px-6 gap-6">
            <div className="w-9 h-9 rounded-xl skeleton" />
            <div className="flex flex-col gap-1.5 flex-1">
              <div className="h-3 w-40 skeleton" />
              <div className="h-2 w-28 skeleton opacity-60" />
            </div>
            <div className="h-4 w-24 skeleton" />
            <div className="h-4 w-20 skeleton" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default LedgerPageSkeleton;
