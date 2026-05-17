import React from "react";

/**
 * DownloadsSkeleton — mirror layout của DownloadsPage.
 * Header + grid of download cards.
 */
export function DownloadsSkeleton() {
  return (
    <div className="flex flex-col gap-8" aria-busy="true">
      <header className="flex flex-col gap-2">
        <div className="h-9 w-56 skeleton rounded-xl" />
        <div className="h-4 w-96 skeleton opacity-50" />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="p-6 rounded-3xl border border-base-content/5 bg-base-200/20 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl skeleton" />
              <div className="flex flex-col gap-1.5">
                <div className="h-4 w-32 skeleton" />
                <div className="h-3 w-24 skeleton opacity-60" />
              </div>
            </div>
            <div className="h-3 w-full skeleton opacity-50" />
            <div className="h-3 w-3/4 skeleton opacity-50" />
            <div className="h-10 w-full skeleton rounded-xl mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default DownloadsSkeleton;
