import React from "react";

/**
 * ProviderEditSkeleton — ghost cho trang edit provider (form).
 */
export function ProviderEditSkeleton() {
  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8 p-6" aria-busy="true">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 skeleton rounded-xl" />
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-8 w-72 skeleton rounded-xl" />
          <div className="h-3 w-96 skeleton opacity-50" />
        </div>
      </div>

      {[1, 2, 3].map((s) => (
        <div key={s} className="p-8 rounded-3xl border border-base-content/5 bg-base-200/20 flex flex-col gap-5">
          <div className="h-5 w-40 skeleton" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="h-3 w-24 skeleton" />
                <div className="h-11 w-full skeleton rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex justify-end gap-3 pt-6 border-t border-base-content/5">
        <div className="h-11 w-24 skeleton rounded-xl" />
        <div className="h-11 w-32 skeleton rounded-xl" />
      </div>
    </div>
  );
}

export default ProviderEditSkeleton;
