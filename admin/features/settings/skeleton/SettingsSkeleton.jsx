import React from "react";



/**

 * SettingsSkeleton  Dng cho trang Admin Settings

 */

export function SettingsSkeleton() {

  return (

    <div className="flex flex-col gap-8 animate-pulse p-4 lg:p-0">

      {/* Header Ghost */}

      <div className="flex flex-col gap-3">

        <div className="h-10 w-64 bg-base-300/60 rounded-2xl" />

        <div className="h-5 w-96 bg-base-300/40 rounded-lg" />

      </div>



      {/* Settings Sections */}

      {[1, 2, 3].map((i) => (

        <div key={i} className="flex flex-col gap-4">

          <div className="h-7 w-48 bg-base-300/50 rounded-lg ml-1" />

          <div className="h-64 w-full bg-base-300/30 rounded-2xl border border-base-border-subtle/10 p-6 flex flex-col gap-6">

            <div className="grid grid-cols-2 gap-6">

              <div className="flex flex-col gap-2">

                <div className="h-4 w-24 bg-base-300/40 rounded" />

                <div className="h-10 w-full bg-base-300/50 rounded-xl" />

              </div>

              <div className="flex flex-col gap-2">

                <div className="h-4 w-24 bg-base-300/40 rounded" />

                <div className="h-10 w-full bg-base-300/50 rounded-xl" />

              </div>

            </div>

            <div className="h-10 w-32 bg-base-300/60 rounded-xl self-end" />

          </div>

        </div>

      ))}

    </div>

  );

}



export default SettingsSkeleton;





