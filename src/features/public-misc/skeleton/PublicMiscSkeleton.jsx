import React from "react";

/**
 * PublicMiscSkeleton — generic ghost cho about/contact/faq/not-found static pages.
 * Most of these pages don't async-load, but skeleton folder is required by pattern.
 */
export function PublicMiscSkeleton() {
  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto py-12" aria-busy="true">
      <div className="flex flex-col gap-4">
        <div className="h-10 w-72 skeleton rounded-2xl" />
        <div className="h-4 w-96 skeleton opacity-50" />
      </div>

      <div className="flex flex-col gap-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className={`h-3 skeleton opacity-50 ${i % 3 === 0 ? "w-3/4" : "w-full"}`} />
        ))}
      </div>

      <div className="h-px w-full bg-base-content/5 my-4" />

      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 rounded-2xl border border-base-content/5 bg-base-200/20 flex flex-col gap-2">
            <div className="h-5 w-48 skeleton" />
            <div className="h-3 w-full skeleton opacity-50" />
            <div className="h-3 w-5/6 skeleton opacity-50" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PublicMiscSkeleton;
