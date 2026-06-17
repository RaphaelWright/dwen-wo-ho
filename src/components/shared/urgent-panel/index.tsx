"use client";

import { m, AnimatePresence } from "motion/react";
import UrgentCard from "../urgent-card";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { UrgentPanelSkeleton } from "../urgent-panel-skeleton";
import type { UrgentPatient } from "@/lib/types/entities/patient";

/**
 * Right-side Urgent Care panel.
 *
 * Accepts patients whose shape matches the PatientCase API DTO,
 * normalised to UrgentPatient.
 */
export default function UrgentPanel({
  patients,
  activeSchool = "all",
  title = "Urgent Care",
  emptyStateText = "No urgent cases for this school",
  className,
  onPatientClick,
  isLoading,
}: {
  patients: UrgentPatient[] | undefined;
  activeSchool?: string | number;
  title?: string;
  emptyStateText?: string;
  className?: string;
  onPatientClick?: (patient: UrgentPatient) => void;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return <UrgentPanelSkeleton />;
  }

  const filtered =
    activeSchool === "all"
      ? (patients ?? [])
      : (patients?.filter((p) => p.schoolId === Number(activeSchool)) ?? []);

  // Sort by newest first (descending) - prioritize urgentCareEnteredAt, fallback to time
  const sorted = filtered.toSorted((a, b) => {
    const dateA = new Date(a.urgentCareEnteredAt || a.time);
    const dateB = new Date(b.urgentCareEnteredAt || b.time);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <aside
      className={cn(
        "bg-destructive/5 flex h-full w-full shrink-0 flex-col overflow-hidden border-l",
        className,
      )}
    >
      {/* Header */}
      <div className="border-muted bg-destructive shrink-0 border-b px-4 pt-5 pb-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold">
            <div className="flex size-7 items-center justify-center rounded-xl border border-white bg-white text-sm">
              🚨
            </div>
            {title}
          </div>

          {/* Count badge */}
          <m.span
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(239,68,68,.5)",
                "0 0 0 5px rgba(239,68,68,0)",
                "0 0 0 0 rgba(239,68,68,.5)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-destructive flex size-7 items-center justify-center rounded-full bg-white p-2 text-xs font-bold"
          >
            {sorted.length > 99 ? "99+" : sorted.length}
          </m.span>
        </div>
      </div>

      {/* Card list */}
      <div className="no-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto p-3 pb-20">
        <TooltipProvider>
          <div className="flex flex-col gap-2">
            <AnimatePresence>
              {sorted.map((p, i) => (
                <UrgentCard
                  key={
                    p.id != null && p.id !== 0
                      ? `urgent-${p.id}`
                      : `urgent-idx-${i}`
                  }
                  patient={p}
                  index={i}
                  onClick={onPatientClick}
                />
              ))}
            </AnimatePresence>

            {sorted.length === 0 && (
              <m.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-8 text-center text-[12px]"
                style={{ color: "#555e72" }}
              >
                {emptyStateText}
              </m.p>
            )}
          </div>
        </TooltipProvider>
      </div>
    </aside>
  );
}
