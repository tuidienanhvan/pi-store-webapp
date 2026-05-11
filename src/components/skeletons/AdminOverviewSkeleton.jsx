import React from "react";



/**

 * AdminOverviewSkeleton  High-fidelity ghost for dashboard home.

 */

export function AdminOverviewSkeleton() {

  return (

    <div className="flex min-h-screen bg-bg">

      {/* Sidebar Ghost */}

      <aside className="hidden lg:flex flex-col w-[var(--sidebar-width)] h-[calc(100vh-32px)] m-4 rounded-3xl bg-base-200/30 border border-base-border">

        <div className="h-24 border-b border-base-border flex items-center px-8">

          <div className="h-7 w-32 skeleton" />

        </div>

        <div className="flex-1 p-4 flex flex-col gap-3">

          {[1, 2, 3, 4, 5, 6].map((i) => (

            <div key={i} className="h-12 w-full skeleton rounded-2xl" />

          ))}

        </div>

        <div className="p-6 border-t border-base-border flex items-center gap-3">

          <div className="w-10 h-10 rounded-full skeleton" />

          <div className="flex-1 flex flex-col gap-1">

            <div className="h-3 w-20 skeleton" />

            <div className="h-2 w-16 skeleton" />

          </div>

        </div>

      </aside>



      <main className="flex-1 flex flex-col min-w-0">

        {/* Topbar Ghost */}

        <header className="h-16 mx-8 mt-4 mb-4 rounded-2xl bg-base-200/30 border border-base-border flex items-center px-6">

          <div className="h-4 w-32 skeleton" />

          <div className="ml-auto flex gap-4">

            <div className="w-8 h-8 rounded-lg skeleton" />

            <div className="w-8 h-8 rounded-lg skeleton" />

          </div>

        </header>



        {/* Page Content */}

        <div className="px-8 pt-4 pb-20">

          <div className="flex flex-col gap-10">

            {/* Header */}

            <div className="flex flex-wrap items-end justify-between gap-6">

              <div className="flex flex-col gap-3">

                <div className="h-10 w-64 skeleton rounded-2xl" />

                <div className="h-4 w-[500px] skeleton rounded-lg" />

              </div>

              <div className="flex gap-2">

                {[1, 2, 3].map((i) => (

                  <div key={i} className="h-10 w-28 skeleton rounded-xl" />

                ))}

              </div>

            </div>



            {/* KPI Cards */}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

              {[1, 2, 3, 4].map((i) => (

                <div key={i} className="h-44 bg-base-200/30 rounded-2xl border border-base-border p-8 flex flex-col gap-4">

                  <div className="h-3 w-24 skeleton" />

                  <div className="h-10 w-32 skeleton rounded-lg" />

                  <div className="mt-auto h-12 w-full skeleton rounded-lg opacity-40" />

                </div>

              ))}

            </div>



            {/* Bottom Sections */}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">

              {[1, 2].map((i) => (

                <div key={i} className="flex flex-col gap-4">

                  <div className="h-4 w-32 skeleton" />

                  <div className="h-64 bg-base-200/20 rounded-2xl border border-base-border" />

                </div>

              ))}

            </div>

          </div>

        </div>

      </main>

    </div>

  );

}



export default AdminOverviewSkeleton;

