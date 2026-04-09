"use client";

import { motion, AnimatePresence } from "framer-motion";
import UrgentCard, { type UrgentPatient } from "./urgent-card";
import { cn } from "@/lib/utils";
import { UrgentPanelSkeleton } from "./urgent-panel-skeleton";

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
      </div>

      {/* Card list */}
      <div className="flex-1 p-3 overflow-y-auto no-scrollbar min-h-0 flex flex-col pb-20">
        <div className="flex flex-col gap-2">
          <AnimatePresence>
            {filtered.map((p, i) => (
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
