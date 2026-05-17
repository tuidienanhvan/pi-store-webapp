import React from "react";

/**
 * HomePageSkeleton — mirror layout của HomePage.
 * Hero + features grid + CTA banner.
 */
export function HomePageSkeleton() {
  return (
    <div className="flex flex-col gap-16" aria-busy="true">
      {/* Hero */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-12">
        <div className="flex flex-col gap-6">
          <div className="h-7 w-32 skeleton rounded-full" />
          <div className="h-16 w-full skeleton rounded-2xl" />
          <div className="h-16 w-3/4 skeleton rounded-2xl" />
          <div className="h-4 w-full skeleton opacity-50" />
          <div className="h-4 w-5/6 skeleton opacity-50" />
          <div className="flex gap-3 mt-4">
            <div className="h-12 w-36 skeleton rounded-xl" />
            <div className="h-12 w-36 skeleton rounded-xl" />
          </div>
        </div>
        <div className="h-[380px] w-full skeleton rounded-3xl" />
      </section>

      {/* Features Grid */}
      <section className="flex flex-col gap-8">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-72 skeleton rounded-2xl" />
          <div className="h-4 w-96 skeleton opacity-50" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-6 rounded-3xl border border-base-content/5 bg-base-200/20 flex flex-col gap-3">
              <div className="w-12 h-12 rounded-2xl skeleton" />
              <div className="h-5 w-40 skeleton" />
              <div className="h-3 w-full skeleton opacity-50" />
              <div className="h-3 w-3/4 skeleton opacity-50" />
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="p-12 rounded-3xl border border-base-content/5 bg-base-200/30 flex flex-col items-center gap-4">
        <div className="h-9 w-96 skeleton rounded-2xl" />
        <div className="h-4 w-[28rem] skeleton opacity-50" />
        <div className="h-12 w-40 skeleton rounded-xl mt-2" />
      </section>
    </div>
  );
}

export default HomePageSkeleton;
