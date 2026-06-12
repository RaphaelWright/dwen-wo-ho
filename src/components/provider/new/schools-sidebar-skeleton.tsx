"use client";

import { m } from "motion/react";

/**
 * Skeleton loader for SchoolsSidebar.
 * Mimics "My Schools" header and school list items.
 */
export function SchoolsSidebarSkeleton() {
  return (
    <aside className="no-scrollbar lg:dark:bg-muted mx-auto flex h-fit w-[96%] shrink-0 flex-col overflow-y-auto pb-40 md:pb-10 lg:mt-6 lg:rounded-2xl lg:bg-[#fcf1e9] lg:pb-2">
      {/* Header label skeleton */}
      <div className="shrink-0 px-4 pt-5 pb-3">
        <div className="h-3 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      </div>

      {/* School list skeleton */}
      <div className="flex-1 px-2.5 pb-4">
        <div className="flex flex-col gap-2">
          {/* "All Schools" item */}
          <div className="flex items-center gap-3 rounded-xl bg-slate-100/50 px-3 py-2.5 dark:bg-slate-800/30">
            <div className="h-8 w-8 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
            <div className="flex-1">
              <div className="mb-1 h-4 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            </div>
            <div className="h-5 w-6 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
          </div>

          {/* Individual school items */}
          {Array.from({ length: 5 }).map((_, i) => (
            <m.div
              key={`school-skeleton-${i}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.1, delay: i * 0.05 }}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5"
            >
              <div className="h-8 w-8 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
              <div className="min-w-0 flex-1">
                <div className="h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              </div>
              <div className="h-5 w-5 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
            </m.div>
          ))}
        </div>
      </div>
    </aside>
  );
}
