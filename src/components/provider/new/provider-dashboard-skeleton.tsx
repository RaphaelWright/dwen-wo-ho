"use client";

import { motion } from "framer-motion";

/**
 * Skeleton loader for provider dashboard main content.
 * Mimics the status filter tabs and patient card layout.
 */
export function ProviderDashboardSkeleton() {
  return (
    <main className="h-full overflow-y-auto no-scrollbar px-2 py-6 pb-40 md:pb-10 lg:ml-4">
      {/* ── Status filter tabs skeleton ── */}
      <div className="flex justify-center mb-6 mx-auto min-[640px]:w-fit">
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/40">
          {/* Tab 1 */}
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl">
            <div className="w-4 h-4 rounded-md bg-slate-200 dark:bg-slate-700 animate-pulse" />
            <div className="w-16 h-4 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
            <div className="w-6 h-5 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
          </div>
          {/* Tab 2 */}
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl">
            <div className="w-4 h-4 rounded-md bg-slate-200 dark:bg-slate-700 animate-pulse" />
            <div className="w-12 h-4 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
            <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
          </div>
          {/* Tab 3 */}
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl">
            <div className="w-4 h-4 rounded-md bg-slate-200 dark:bg-slate-700 animate-pulse" />
            <div className="w-14 h-4 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
            <div className="w-6 h-5 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
          </div>
        </div>
      </div>

      {/* ── Patient cards skeleton ── */}
      <div className="flex flex-col gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={`skeleton-${i}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.2,
              delay: Math.min(i * 0.05, 0.3),
              ease: "easeOut",
            }}
            className="relative flex items-center gap-3 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/50 bg-white dark:bg-slate-900/50 backdrop-blur-sm"
          >
            {/* Score ring skeleton */}
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
            </div>

            {/* Content skeleton */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-32 h-5 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
                <div className="w-16 h-4 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-20 h-3.5 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
                <div className="w-24 h-3.5 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
              </div>
            </div>

            {/* Time skeleton */}
            <div className="hidden sm:block">
              <div className="w-14 h-3 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
            </div>

            {/* Action button skeleton */}
            <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
          </motion.div>
        ))}
      </div>
    </main>
  );
}
