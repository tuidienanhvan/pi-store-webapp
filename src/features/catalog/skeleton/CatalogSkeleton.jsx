import React from "react";

/**
 * CatalogSkeleton — mirror layout của Catalog.
 * Header + product grid.
 */
export function CatalogSkeleton() {
  return (
    <div className="flex flex-col gap-8" aria-busy="true">
      <header className="flex flex-col gap-3">
        <div className="h-10 w-72 skeleton rounded-2xl" />
        <div className="h-4 w-96 skeleton opacity-50" />
      </header>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-9 w-24 skeleton rounded-full" />
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-3xl border border-base-content/5 bg-base-200/20 overflow-hidden flex flex-col">
            <div className="h-44 w-full skeleton" />
            <div className="p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="h-5 w-40 skeleton" />
                <div className="h-6 w-16 skeleton rounded-full" />
              </div>
              <div className="h-3 w-full skeleton opacity-50" />
              <div className="h-3 w-3/4 skeleton opacity-50" />
              <div className="flex justify-between items-center pt-3 border-t border-base-content/5">
                <div className="h-7 w-24 skeleton" />
                <div className="h-9 w-28 skeleton rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CatalogSkeleton;
