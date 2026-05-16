import React from "react";

/**
 * UserProfileSkeleton — mirror layout của ProfilePage.
 * Header + form sections (avatar + name + email + password).
 */
export function UserProfileSkeleton() {
  return (
    <div className="flex flex-col gap-8" aria-busy="true">
      <header className="flex flex-col gap-2">
        <div className="h-9 w-56 skeleton rounded-xl" />
        <div className="h-4 w-96 skeleton opacity-50" />
      </header>

      <div className="p-8 rounded-3xl border border-base-content/5 bg-base-200/20 flex flex-col gap-5">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full skeleton" />
          <div className="flex flex-col gap-2">
            <div className="h-5 w-40 skeleton" />
            <div className="h-3 w-32 skeleton opacity-60" />
          </div>
        </div>
      </div>

      {[1, 2].map((s) => (
        <div key={s} className="p-8 rounded-3xl border border-base-content/5 bg-base-200/20 flex flex-col gap-5">
          <div className="h-5 w-40 skeleton" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[1, 2].map((i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="h-3 w-24 skeleton" />
                <div className="h-11 w-full skeleton rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default UserProfileSkeleton;
