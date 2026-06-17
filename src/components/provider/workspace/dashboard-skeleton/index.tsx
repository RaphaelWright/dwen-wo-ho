"use client";

import { m } from "motion/react";

/**
 * Skeleton loader for provider dashboard main content.
 * Mimics the status filter tabs and patient card layout.
 */
export function ProviderDashboardSkeleton() {
  return (
    <main className="no-scrollbar h-full overflow-y-auto px-2 py-6 pb-40 md:pb-10 lg:ml-4">
      {/* ── Status filter tabs skeleton ── */}
      <div className="mx-auto mb-6 flex justify-center min-[640px]:w-fit">
        <div className="flex items-center gap-1 rounded-2xl border border-slate-200/60 bg-slate-100/80 p-1 dark:border-slate-700/40 dark:bg-slate-800/50">
          {/* Tab 1 */}
          <div className="flex items-center gap-2 rounded-xl px-4 py-2.5">
            <div className="h-4 w-4 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" />
            <div className="h-4 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-5 w-6 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
          </div>
          {/* Tab 2 */}
          <div className="flex items-center gap-2 rounded-xl px-4 py-2.5">
            <div className="h-4 w-4 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" />
            <div className="h-4 w-12 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-5 w-5 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
          </div>
          {/* Tab 3 */}
          <div className="flex items-center gap-2 rounded-xl px-4 py-2.5">
            <div className="h-4 w-4 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" />
            <div className="h-4 w-14 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-5 w-6 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      </div>

      {/* ── Patient cards skeleton ── */}
      <div className="flex flex-col gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <m.div
            key={`skeleton-${i}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.2,
              delay: Math.min(i * 0.05, 0.3),
              ease: "easeOut",
            }}
            className="relative flex items-center gap-3 rounded-xl border border-slate-200/60 bg-white p-3 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-900/50"
          >
            {/* Score ring skeleton */}
            <div className="relative shrink-0">
              <div className="h-12 w-12 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
            </div>

            {/* Content skeleton */}
            <div className="min-w-0 flex-1">
              <div className="mb-1.5 flex items-center gap-2">
                <div className="h-5 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-4 w-16 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3.5 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-2 w-2 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
                <div className="h-3.5 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              </div>
            </div>

            {/* Time skeleton */}
            <div className="hidden sm:block">
              <div className="h-3 w-14 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            </div>

            {/* Action button skeleton */}
            <div className="h-8 w-8 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
          </m.div>
        ))}
      </div>
    </main>
  );
}
