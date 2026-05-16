import React from "react";

/**
 * AuthFormSkeleton — fallback ghost cho auth forms (login/signup/forgot-password).
 * Hiếm khi cần — auth forms thường không async. Dùng khi cần hydrate-time guard.
 */
export function AuthFormSkeleton() {
  return (
    <div className="flex flex-col gap-6 max-w-md mx-auto" aria-busy="true">
      <div className="flex flex-col gap-2">
        <div className="h-9 w-56 skeleton rounded-xl" />
        <div className="h-4 w-72 skeleton opacity-50" />
      </div>
      <div className="flex flex-col gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="h-3 w-24 skeleton" />
            <div className="h-11 w-full skeleton rounded-xl" />
          </div>
        ))}
        <div className="h-11 w-full skeleton rounded-xl mt-2" />
      </div>
    </div>
  );
}

export default AuthFormSkeleton;
