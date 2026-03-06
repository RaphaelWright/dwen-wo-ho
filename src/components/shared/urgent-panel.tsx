"use client";

import { motion, AnimatePresence } from "framer-motion";
import UrgentCard from "./urgent-card";
import { cn } from "@/lib/utils";

/**
 * Right-side Urgent Care panel.
 *
 * @param {{
 *   patients: Array<{
 *     id: string | number;
 *     name: string;
 *     school: string;
 *     schoolLabel: string;
 *     time: string;
 *     score: number;
 *     emoji: string;
 *     avatarUrl?: string;
 *   }>;
 *   activeSchool?: string;
 *   title?: string;
 *   subtitle?: string;
 *   emptyStateText?: string;
 *   className?: string;
 * }} props
 */
export default function UrgentPanel({
  patients,
  activeSchool = "all",
  title = "Urgent Care",
  subtitle = "Across all schools · Latest first",
  emptyStateText = "No urgent cases for this school",
  className,
}: {
  patients: Array<{
    id: string | number;
    name: string;
    school: string;
    schoolLabel: string;
    time: string;
    score: number;
    avatarUrl?: string;
  }>;
  activeSchool?: string;
  title?: string;
  subtitle?: string;
  emptyStateText?: string;
  className?: string;
}) {
  const filtered = patients.filter(
    (p) => activeSchool === "all" || p.school === activeSchool,
  );

  return (
    <aside
      className={cn(
        "w-full shrink-0 flex flex-col h-full border-l bg-destructive/5 overflow-hidden",
        className,
      )}
    >
      {/* Header */}
      <div className="px-4 pt-5 pb-4 border-b shrink-0 border-muted bg-destructive text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold">
            <div className="size-7 rounded-xl flex items-center justify-center text-sm border bg-white border-white">
              🚨
            </div>
            {title}
          </div>

          {/* Count badge */}
          <motion.span
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(239,68,68,.5)",
                "0 0 0 5px rgba(239,68,68,0)",
                "0 0 0 0 rgba(239,68,68,.5)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-sm flex items-center justify-center font-bold text-destructive size-6 rounded-full bg-white"
          >
            {filtered.length}
          </motion.span>
        </div>

        <p className="text-[11px] mt-1 text-white/80">{subtitle}</p>
      </div>

      {/* Card list */}
      <div className="flex-1 p-3 overflow-y-auto no-scrollbar min-h-0 flex flex-col pb-20">
        <div className="flex flex-col gap-2">
          <AnimatePresence>
            {filtered.map((p, i) => (
              <UrgentCard key={p.id} patient={p} index={i} />
            ))}
          </AnimatePresence>

          {filtered.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-[12px] py-8"
              style={{ color: "#555e72" }}
            >
              {emptyStateText}
            </motion.p>
          )}
        </div>
      </div>
    </aside>
  );
}
