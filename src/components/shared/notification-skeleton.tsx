"use client";

import { motion } from "framer-motion";

/**
 * Skeleton loader for notification items in the notification sheet.
 * Mimics the notification card layout with avatar, content, and actions.
 */
export function NotificationSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-2 py-4">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={`notif-skeleton-${i}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.2,
            delay: Math.min(i * 0.05, 0.3),
            ease: "easeOut",
          }}
          className="relative flex items-start gap-3 p-4 rounded-xl border border-border bg-card"
        >
          {/* Avatar skeleton */}
          <div className="w-9 h-9 rounded-full bg-muted animate-pulse shrink-0" />

          {/* Content skeleton */}
          <div className="flex-1 min-w-0 space-y-2">
            {/* Title row */}
            <div className="flex items-center justify-between">
              <div className="w-24 h-4 rounded bg-muted animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-muted animate-pulse" />
            </div>
            {/* Message row */}
            <div className="w-full h-3.5 rounded bg-muted animate-pulse" />
            {/* Meta row */}
            <div className="w-16 h-3 rounded bg-muted animate-pulse" />
          </div>

          {/* Actions skeleton */}
          <div className="flex flex-col gap-1 shrink-0">
            <div className="w-7 h-7 rounded-md bg-muted animate-pulse" />
            <div className="w-7 h-7 rounded-md bg-muted animate-pulse" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
