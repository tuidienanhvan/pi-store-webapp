import React from "react";

/**
 * CheckoutSuccessSkeleton — ghost cho CheckoutSuccessPage.
 * Centered confirmation card.
 */
export function CheckoutSuccessSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-12 max-w-2xl mx-auto" aria-busy="true">
      <div className="w-20 h-20 rounded-full skeleton" />
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-72 skeleton rounded-xl" />
        <div className="h-4 w-96 skeleton opacity-50" />
        <div className="h-4 w-80 skeleton opacity-50" />
      </div>
      <div className="w-full p-6 rounded-3xl border border-base-content/5 bg-base-200/20 flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex justify-between">
            <div className="h-3 w-32 skeleton opacity-60" />
            <div className="h-3 w-24 skeleton" />
          </div>
        ))}
      </div>
      <div className="h-11 w-48 skeleton rounded-xl" />
    </div>
  );
}

export default CheckoutSuccessSkeleton;
