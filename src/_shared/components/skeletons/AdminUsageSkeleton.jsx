import React from "react";



/**

 * AdminUsageSkeleton  Dng cho trang Admin Usage (Analytics)

 */

export function AdminUsageSkeleton() {

  return (

    <div className="flex flex-col gap-8 animate-pulse p-4 lg:p-0">

      {/* Header Ghost */}

      <div className="flex flex-col gap-3">

        <div className="h-10 w-64 bg-base-300/60 rounded-2xl" />

        <div className="h-5 w-96 bg-base-300/40 rounded-lg" />

      </div>



      {/* Filter Bar Ghost */}

      <div className="h-20 w-full bg-base-300/30 rounded-2xl border border-base-border-subtle/10 p-4 flex gap-4 items-center">

        <div className="h-10 w-24 bg-base-300/50 rounded-xl" />

        {[1, 2, 3].map((i) => (

          <div key={i} className="h-10 w-32 bg-base-300/50 rounded-xl" />

        ))}

      </div>



      {/* Stats Grid Ghost */}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">

        {[1, 2, 3, 4, 5, 6].map((i) => (

          <div key={i} className="h-32 bg-base-300/30 rounded-2xl border border-base-border-subtle/10 p-4 flex flex-col justify-between">

            <div className="h-4 w-20 bg-base-300/40 rounded" />

            <div className="h-8 w-24 bg-base-300/50 rounded-lg" />

          </div>

        ))}

      </div>



      {/* Chart Ghost */}

      <div className="flex flex-col gap-4">

        <div className="h-7 w-48 bg-base-300/50 rounded-lg" />

        <div className="h-64 w-full bg-base-300/30 rounded-2xl border border-base-border-subtle/10 p-6 flex items-end gap-2">

          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((i) => (

            <div key={i} className="flex-1 bg-base-300/50 rounded-t-lg" style={{ height: `${((i * 17) % 80) + 20}%` }} />

          ))}

        </div>

      </div>



      {/* Tables Grid Ghost */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {[1, 2].map((i) => (

          <div key={i} className="flex flex-col gap-4">

            <div className="h-7 w-48 bg-base-300/50 rounded-lg" />

            <div className="h-64 w-full bg-base-300/30 rounded-2xl border border-base-border-subtle/10 overflow-hidden">

               <div className="h-12 w-full bg-base-300/40 border-b border-base-border-subtle/10" />

               {[1, 2, 3, 4].map((j) => (

                 <div key={j} className="h-16 w-full border-b border-base-border-subtle/5 flex items-center px-6 gap-6">

                    <div className="h-4 flex-1 bg-base-300/30 rounded" />

                    <div className="h-4 w-32 bg-base-300/30 rounded" />

                 </div>

               ))}

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}



export default AdminUsageSkeleton;

