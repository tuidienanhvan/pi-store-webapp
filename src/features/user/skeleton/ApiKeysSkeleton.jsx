import React from "react";

/**
 * ApiKeysSkeleton — mirror layout của ApiKeysPage.
 * Header + key list.
 */
export function ApiKeysSkeleton() {
  return (
    <div className="flex flex-col gap-8" aria-busy="true">
      <header className="flex flex-col gap-2">
        <div className="h-9 w-56 skeleton rounded-xl" />
        <div className="h-4 w-96 skeleton opacity-50" />
      </header>

      <div className="p-6 rounded-3xl border border-base-content/5 bg-base-200/20 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="h-5 w-40 skeleton" />
          <div className="h-10 w-32 skeleton rounded-xl" />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-base-content/5">
            <div className="w-10 h-10 rounded-xl skeleton" />
            <div className="flex flex-col gap-1.5 flex-1">
              <div className="h-3 w-48 skeleton" />
              <div className="h-2 w-32 skeleton opacity-60" />
            </div>
            <div className="h-6 w-16 skeleton rounded-full" />
            <div className="w-9 h-9 skeleton rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ApiKeysSkeleton;
