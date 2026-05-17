import React from "react";

/**
 * SupportPageSkeleton — mirror layout của SupportPage.
 * Header + ticket form + recent tickets list.
 */
export function SupportPageSkeleton() {
  return (
    <div className="flex flex-col gap-8" aria-busy="true">
      <header className="flex flex-col gap-2">
        <div className="h-9 w-64 skeleton rounded-xl" />
        <div className="h-4 w-96 skeleton opacity-50" />
      </header>

      {/* Form */}
      <div className="p-8 rounded-3xl border border-base-content/5 bg-base-200/20 flex flex-col gap-5">
        <div className="h-5 w-48 skeleton" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2].map((i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="h-3 w-24 skeleton" />
              <div className="h-11 w-full skeleton rounded-xl" />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <div className="h-3 w-24 skeleton" />
          <div className="h-32 w-full skeleton rounded-xl" />
        </div>
        <div className="flex justify-end">
          <div className="h-11 w-36 skeleton rounded-xl" />
        </div>
      </div>

      {/* Recent tickets */}
      <div className="flex flex-col gap-3">
        <div className="h-5 w-40 skeleton" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-base-content/5 bg-base-200/20">
            <div className="w-10 h-10 rounded-xl skeleton" />
            <div className="flex flex-col gap-1.5 flex-1">
              <div className="h-3 w-64 skeleton" />
              <div className="h-2 w-32 skeleton opacity-60" />
            </div>
            <div className="h-6 w-20 skeleton rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default SupportPageSkeleton;
