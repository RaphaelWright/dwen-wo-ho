"use client";

import { m } from "motion/react";

/**
 * Skeleton loader for UrgentPanel.
 * Mimics the urgent care header and urgent card list.
 */
export function UrgentPanelSkeleton() {
  return (
    <aside className="w-full shrink-0 flex flex-col h-full border-l bg-destructive/5 overflow-hidden">
      {/* Header skeleton */}
      <div className="px-4 pt-5 pb-4 border-b shrink-0 border-muted bg-destructive text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold">
            <div className="size-7 rounded-xl flex items-center justify-center text-sm border bg-white border-white">
              <div className="w-4 h-4 rounded bg-slate-200 animate-pulse" />
            </div>
            <div className="w-20 h-4 rounded bg-white/50 animate-pulse" />
          </div>

          {/* Count badge skeleton */}
          <div className="text-sm flex items-center justify-center font-bold text-destructive size-6 rounded-full bg-white animate-pulse" />
        </div>
      </div>

      {/* Card list skeleton */}
      <div className="flex-1 p-3 overflow-y-auto no-scrollbar min-h-0 flex flex-col pb-20">
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <m.div
              key={`urgent-skeleton-${i}`}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15, delay: i * 0.05 }}
              className="p-4 rounded-lg border border-destructive/20 bg-destructive/5 backdrop-blur-sm"
            >
              {/* Patient name row */}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-24 h-4 rounded bg-destructive/20 animate-pulse" />
                <div className="w-16 h-4 rounded-full bg-destructive/20 animate-pulse" />
              </div>
              {/* School and time row */}
              <div className="flex items-center justify-between">
                <div className="w-20 h-3 rounded bg-destructive/10 animate-pulse" />
                <div className="w-14 h-3 rounded bg-destructive/10 animate-pulse" />
              </div>
            </m.div>
          ))}
        </div>
      </div>
    </aside>
  );
}
