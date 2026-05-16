import React from "react";

/**
 * WalletPageSkeleton — mirror layout của WalletPage.
 * Header + balance grid (3 cards) + pack list.
 */
export function WalletPageSkeleton() {
  return (
    <div className="wallet-container flex flex-col gap-8" aria-busy="true">
      <header className="flex flex-col gap-2">
        <div className="h-9 w-64 skeleton rounded-xl" />
        <div className="h-4 w-[28rem] skeleton opacity-50" />
      </header>

      {/* Balance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-8 rounded-3xl border border-base-content/5 bg-base-200/30 flex flex-col gap-3">
          <div className="h-3 w-24 skeleton opacity-60" />
          <div className="h-12 w-40 skeleton" />
          <div className="h-3 w-16 skeleton opacity-50" />
        </div>
        <div className="p-8 rounded-3xl border border-base-content/5 bg-base-200/30 flex flex-col gap-3">
          <div className="h-3 w-24 skeleton opacity-60" />
          <div className="h-8 w-32 skeleton" />
          <div className="h-3 w-20 skeleton opacity-50" />
        </div>
        <div className="p-8 rounded-3xl border border-base-content/5 bg-base-200/30 flex flex-col gap-3">
          <div className="h-3 w-24 skeleton opacity-60" />
          <div className="h-8 w-32 skeleton" />
          <div className="h-3 w-20 skeleton opacity-50" />
        </div>
      </div>

      {/* Pack list */}
      <div className="flex flex-col gap-4">
        <div className="h-6 w-48 skeleton" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 rounded-3xl border border-base-content/5 bg-base-200/20 flex flex-col gap-3">
              <div className="h-5 w-32 skeleton" />
              <div className="h-9 w-40 skeleton" />
              <div className="h-3 w-48 skeleton opacity-60" />
              <div className="h-11 w-full skeleton rounded-xl mt-3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WalletPageSkeleton;
