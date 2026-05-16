import React from "react";

/**
 * BillingPageSkeleton — mirror layout của BillingPage.
 * Header với tier badge + quota card + actions stack.
 */
export function BillingPageSkeleton() {
  return (
    <div className="flex flex-col gap-8" aria-busy="true">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="h-9 w-40 skeleton rounded-xl" />
          <div className="h-6 w-16 skeleton rounded-full" />
        </div>
        <div className="h-4 w-96 skeleton opacity-50" />
      </div>

      {/* Quota Card */}
      <div className="p-8 rounded-3xl border border-base-content/5 bg-base-200/20 flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <div className="h-5 w-40 skeleton" />
          <div className="h-6 w-20 skeleton rounded-full" />
        </div>
        <div className="flex justify-between">
          <div className="h-10 w-32 skeleton" />
          <div className="h-10 w-24 skeleton" />
        </div>
        <div className="h-2 w-full skeleton rounded-full" />
        <div className="h-3 w-48 skeleton opacity-50" />
      </div>

      {/* Tier Selector */}
      <div className="p-8 rounded-3xl border border-base-content/5 bg-base-200/20 flex flex-col gap-5">
        <div className="h-5 w-48 skeleton" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-5 rounded-2xl border border-base-content/5 flex flex-col gap-3">
              <div className="h-4 w-20 skeleton" />
              <div className="h-8 w-24 skeleton" />
              <div className="h-3 w-32 skeleton opacity-60" />
              <div className="h-10 w-full skeleton rounded-xl mt-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BillingPageSkeleton;
