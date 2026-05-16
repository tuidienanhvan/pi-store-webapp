import React from "react";

/**
 * UserProfileSkeleton — ghost cho trang user profile (avatar header + tabs + body).
 */
export function UserProfileSkeleton() {
  return (
    <div className="pi-user-profile flex flex-col gap-8" aria-busy="true">
      {/* Header */}
      <div className="flex items-end gap-6">
        <div className="w-24 h-24 rounded-full skeleton" />
        <div className="flex flex-col gap-3 flex-1">
          <div className="h-8 w-72 skeleton rounded-2xl" />
          <div className="h-4 w-96 skeleton opacity-50" />
          <div className="flex gap-2 mt-2">
            <div className="h-6 w-20 skeleton rounded-full" />
            <div className="h-6 w-24 skeleton rounded-full" />
          </div>
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-32 skeleton rounded-xl" />
          <div className="h-10 w-32 skeleton rounded-xl" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-base-content/5 pb-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-9 w-32 skeleton rounded-lg" />
        ))}
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-8 rounded-3xl border border-base-content/5 bg-base-200/20 flex flex-col gap-5">
          <div className="h-5 w-40 skeleton" />
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="h-3 w-24 skeleton" />
                <div className="h-6 w-32 skeleton" />
              </div>
            ))}
          </div>
        </div>
        <div className="p-6 rounded-3xl border border-base-content/5 bg-base-200/20 flex flex-col gap-3">
          <div className="h-4 w-32 skeleton" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between">
              <div className="h-3 w-20 skeleton" />
              <div className="h-3 w-16 skeleton" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserProfileSkeleton;
