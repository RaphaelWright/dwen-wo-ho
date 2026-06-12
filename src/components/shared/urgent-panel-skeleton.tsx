"use client";

import { m } from "motion/react";

/**
 * Skeleton loader for UrgentPanel.
 * Mimics the urgent care header and urgent card list.
 */
export function UrgentPanelSkeleton() {
  return (
    <aside className="bg-destructive/5 flex h-full w-full shrink-0 flex-col overflow-hidden border-l">
      {/* Header skeleton */}
      <div className="border-muted bg-destructive shrink-0 border-b px-4 pt-5 pb-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold">
            <div className="flex size-7 items-center justify-center rounded-xl border border-white bg-white text-sm">
              <div className="h-4 w-4 animate-pulse rounded bg-slate-200" />
            </div>
            <div className="h-4 w-20 animate-pulse rounded bg-white/50" />
          </div>

          {/* Count badge skeleton */}
          <div className="text-destructive flex size-6 animate-pulse items-center justify-center rounded-full bg-white text-sm font-bold" />
        </div>
      </div>

      {/* Card list skeleton */}
      <div className="no-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto p-3 pb-20">
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <m.div
              key={`urgent-skeleton-${i}`}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15, delay: i * 0.05 }}
              className="border-destructive/20 bg-destructive/5 rounded-lg border p-4 backdrop-blur-sm"
            >
              {/* Patient name row */}
              <div className="mb-2 flex items-center gap-2">
                <div className="bg-destructive/20 h-4 w-24 animate-pulse rounded" />
                <div className="bg-destructive/20 h-4 w-16 animate-pulse rounded-full" />
              </div>
              {/* School and time row */}
              <div className="flex items-center justify-between">
                <div className="bg-destructive/10 h-3 w-20 animate-pulse rounded" />
                <div className="bg-destructive/10 h-3 w-14 animate-pulse rounded" />
              </div>
            </m.div>
          ))}
        </div>
      </div>
    </aside>
  );
}
