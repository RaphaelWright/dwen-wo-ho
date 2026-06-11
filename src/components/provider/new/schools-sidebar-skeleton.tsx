"use client";

import { m } from "motion/react";

/**
 * Skeleton loader for SchoolsSidebar.
 * Mimics "My Schools" header and school list items.
 */
export function SchoolsSidebarSkeleton() {
  return (
    <aside className="w-[96%] mx-auto shrink-0 flex flex-col overflow-y-auto no-scrollbar h-fit pb-40 md:pb-10 lg:bg-[#fcf1e9] lg:dark:bg-muted lg:rounded-2xl lg:mt-6 lg:pb-2">
      {/* Header label skeleton */}
      <div className="px-4 pt-5 pb-3 shrink-0">
        <div className="w-20 h-3 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
      </div>

      {/* School list skeleton */}
      <div className="flex-1 px-2.5 pb-4">
        <div className="flex flex-col gap-2">
          {/* "All Schools" item */}
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-800/30">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
            <div className="flex-1">
              <div className="w-20 h-4 rounded bg-slate-200 dark:bg-slate-700 animate-pulse mb-1" />
            </div>
            <div className="w-6 h-5 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
          </div>

          {/* Individual school items */}
          {Array.from({ length: 5 }).map((_, i) => (
            <m.div
              key={`school-skeleton-${i}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.1, delay: i * 0.05 }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
            >
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
              <div className="flex-1 min-w-0">
                <div className="w-32 h-4 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
              </div>
              <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
            </m.div>
          ))}
        </div>
      </div>
    </aside>
  );
}
