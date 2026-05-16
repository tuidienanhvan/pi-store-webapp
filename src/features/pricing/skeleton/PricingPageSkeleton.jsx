import React from "react";

/**
 * PricingPageSkeleton — mirror layout của PricingPage.
 * Header + tier cards grid.
 */
export function PricingPageSkeleton() {
  return (
    <div className="flex flex-col gap-12 py-12" aria-busy="true">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-96 skeleton rounded-2xl" />
        <div className="h-4 w-[32rem] skeleton opacity-50" />
        <div className="flex gap-2 mt-2">
          <div className="h-10 w-24 skeleton rounded-full" />
          <div className="h-10 w-24 skeleton rounded-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-8 rounded-3xl border border-base-content/5 bg-base-200/20 flex flex-col gap-4">
            <div className="h-5 w-24 skeleton" />
            <div className="h-12 w-32 skeleton" />
            <div className="h-3 w-40 skeleton opacity-60" />
            <div className="h-px w-full bg-base-content/5 my-3" />
            <div className="flex flex-col gap-2">
              {[1, 2, 3, 4, 5].map((j) => (
                <div key={j} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full skeleton shrink-0" />
                  <div className="h-3 w-40 skeleton opacity-60" />
                </div>
              ))}
            </div>
            <div className="h-11 w-full skeleton rounded-xl mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PricingPageSkeleton;
