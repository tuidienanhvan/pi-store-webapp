import React from "react";
import './OverviewSkeleton.css';



/**

 * OverviewSkeleton  High-fidelity ghost for dashboard home.

 */

export function OverviewSkeleton() {
  return (
    <div className="flex flex-col gap-12 stagger-1">
      {/* Header Ghost */}
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-col gap-4">
          <div className="h-14 w-96 skeleton rounded-3xl" />
          <div className="h-4 w-64 skeleton rounded-lg opacity-40" />
        </div>
        <div className="flex gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 w-28 skeleton rounded-xl" />
          ))}
        </div>
      </div>

      {/* Row 1: Bento Grid Ghost */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Main Revenue Bento (Huge) */}
        <div className="md:col-span-8 h-[320px] bg-base-200/20 rounded-[2.5rem] border border-white/5 p-12 flex flex-col gap-8">
           <div className="h-4 w-32 skeleton" />
           <div className="h-16 w-64 skeleton rounded-2xl" />
           <div className="mt-auto h-24 w-full skeleton rounded-2xl opacity-20" />
        </div>

        {/* System Health Bento (Vertical) */}
        <div className="md:col-span-4 h-full bg-base-200/20 rounded-[2.5rem] border border-white/5 p-10 flex flex-col gap-8">
           <div className="h-4 w-32 skeleton" />
           <div className="flex flex-col gap-6">
             {[1,2,3,4].map(i => (
               <div key={i} className="flex flex-col gap-3">
                 <div className="flex justify-between"><div className="h-3 w-16 skeleton" /><div className="h-3 w-12 skeleton" /></div>
                 <div className="h-1.5 w-full skeleton rounded-full" />
               </div>
             ))}
           </div>
        </div>

        {/* Licenses Bento */}
        <div className="md:col-span-4 h-[240px] bg-base-200/20 rounded-[2.5rem] border border-white/5 p-10 flex flex-col gap-6">
           <div className="h-4 w-32 skeleton" />
           <div className="h-12 w-48 skeleton rounded-xl" />
           <div className="mt-auto h-4 w-full skeleton rounded-full" />
        </div>

        {/* Usage Bento */}
        <div className="md:col-span-8 h-[240px] bg-base-200/20 rounded-[2.5rem] border border-white/5 p-10 flex flex-col gap-6">
           <div className="h-4 w-32 skeleton" />
           <div className="h-12 w-48 skeleton rounded-xl" />
           <div className="mt-auto h-12 w-full skeleton rounded-2xl opacity-20" />
        </div>
      </div>
    </div>
  );
}

export default OverviewSkeleton;





