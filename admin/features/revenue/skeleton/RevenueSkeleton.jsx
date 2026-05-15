import React from "react";



export function RevenueSkeleton() {

  return (

    <div className="flex flex-col gap-8 animate-pulse p-4 lg:p-0">

      <div className="flex flex-col gap-3 lg:flex-row lg:justify-between lg:items-start">

        <div className="flex flex-col gap-2">

          <div className="h-10 w-64 bg-base-300/60 rounded-2xl" />

          <div className="h-5 w-80 bg-base-300/40 rounded-lg" />

        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {[1, 2, 3, 4].map((i) => (

          <div key={i} className="h-32 rounded-2xl p-5 bg-base-300/30 border border-base-border-subtle/10" />

        ))}

      </div>

      <div className="h-96 w-full bg-base-300/20 rounded-3xl" />

    </div>

  );

}



export default RevenueSkeleton;

