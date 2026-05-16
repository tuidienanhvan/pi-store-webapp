import React from "react";

/**
 * DocsPageSkeleton — mirror layout của DocsPage.
 * Hero + sidebar nav + content body.
 */
export function DocsPageSkeleton() {
  return (
    <div className="flex flex-col gap-8" aria-busy="true">
      {/* Hero */}
      <div className="flex flex-col items-center gap-4 py-12">
        <div className="h-12 w-96 skeleton rounded-2xl" />
        <div className="h-4 w-[36rem] skeleton opacity-50" />
        <div className="h-12 w-full max-w-xl skeleton rounded-2xl mt-4" />
      </div>

      {/* 2-column docs layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
        {/* Sidebar nav */}
        <aside className="flex flex-col gap-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-col gap-2">
              <div className="h-4 w-24 skeleton" />
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-3 w-32 skeleton opacity-50" />
              ))}
            </div>
          ))}
        </aside>

        {/* Content body */}
        <article className="flex flex-col gap-4">
          <div className="h-8 w-72 skeleton rounded-xl" />
          <div className="flex flex-col gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={`h-3 skeleton opacity-50 ${i % 3 === 0 ? "w-3/4" : "w-full"}`} />
            ))}
          </div>
          <div className="h-44 w-full skeleton rounded-2xl my-2" />
          <div className="flex flex-col gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`h-3 skeleton opacity-50 ${i % 2 === 0 ? "w-5/6" : "w-full"}`} />
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}

export default DocsPageSkeleton;
