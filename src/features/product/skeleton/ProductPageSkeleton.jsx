import React from "react";

/**
 * ProductPageSkeleton — mirror layout của product detail page.
 * Hero + features + pricing section.
 */
export function ProductPageSkeleton() {
  return (
    <div className="flex flex-col gap-16 py-12" aria-busy="true">
      {/* Hero */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-5">
          <div className="h-7 w-32 skeleton rounded-full" />
          <div className="h-14 w-full skeleton rounded-2xl" />
          <div className="h-14 w-3/4 skeleton rounded-2xl" />
          <div className="h-4 w-full skeleton opacity-50" />
          <div className="h-4 w-5/6 skeleton opacity-50" />
          <div className="flex gap-3 mt-4">
            <div className="h-12 w-36 skeleton rounded-xl" />
            <div className="h-12 w-36 skeleton rounded-xl" />
          </div>
        </div>
        <div className="h-[400px] w-full skeleton rounded-3xl" />
      </section>

      {/* Features section */}
      <section className="flex flex-col gap-8">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-72 skeleton rounded-2xl" />
          <div className="h-4 w-96 skeleton opacity-50" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-8 rounded-3xl border border-base-content/5 bg-base-200/20 flex flex-col gap-4">
              <div className="w-14 h-14 rounded-2xl skeleton" />
              <div className="h-6 w-48 skeleton" />
              <div className="h-3 w-full skeleton opacity-50" />
              <div className="h-3 w-3/4 skeleton opacity-50" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default ProductPageSkeleton;
