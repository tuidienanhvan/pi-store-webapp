import React from "react";

export function TokenLedgerSkeleton() {
  return (
    <div className="pi-token-ledger flex flex-col gap-8" aria-busy="true">
      <div className="flex flex-col gap-3">
        <div className="h-10 w-64 skeleton rounded-2xl" />
        <div className="h-4 w-96 skeleton rounded-lg opacity-40" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => <div key={i} className="h-24 rounded-3xl skeleton" />)}
      </div>

      <div className="p-6 rounded-3xl bg-base-200/20 border border-base-content/5 flex flex-wrap gap-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-10 w-40 skeleton rounded-xl" />
        ))}
      </div>

      <div className="rounded-3xl border border-base-content/5 bg-base-200/20 overflow-hidden">
        <div className="h-12 w-full bg-base-content/5 border-b border-base-content/5" />
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="h-14 w-full border-b border-base-content/5 flex items-center px-8 gap-8">
            <div className="h-3 w-32 skeleton" />
            <div className="h-4 w-40 skeleton" />
            <div className="h-4 w-20 skeleton ml-auto" />
            <div className="h-5 w-20 skeleton rounded-full" />
            <div className="h-3 w-48 skeleton" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default TokenLedgerSkeleton;
