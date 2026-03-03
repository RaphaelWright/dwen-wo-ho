"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Filter } from "lucide-react";
import { NEW_PROVIDER_STATUS_CHIPS } from "@/data/mock-provider-data";
import PatientCard from "./patient-card";
import useNewProvider from "@/hooks/provider/use-new-provider";
import { cn } from "@/lib/utils";

/**
 * Center scroll area — filter bar, status chips, and the patient card list.
 *
 * @param {{
 *   activeSchool:    string,
 *   activeStatus:    string,
 *   searchQuery:     string,
 *   onClearSchool:   () => void,
 *   onSelectStatus:  (id: string) => void,
 * }} props
 */
export default function MainContent() {
  const {
    activeSchool,
    activeStatus,
    handleClearSchool,
    setActiveStatus,
    schoolLabel,
    countForChip,
    filteredPatients,
  } = useNewProvider();

  return (
    <main className="h-full overflow-y-auto no-scrollbar px-2 py-6 pb-40 md:pb-10">
      {/* ── Active-school filter bar ── */}
      <AnimatePresence>
        {activeSchool !== "all" && (
          <motion.div
            key="filter-bar"
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border mb-4 text-[12.5px] bg-primary/10 text-primary"
          >
            <Filter size={13} />
            Showing patients from <strong>{schoolLabel}</strong>
            <button
              onClick={handleClearSchool}
              className="ml-auto text-[11.5px] font-semibold cursor-pointer transition-colors text-muted-foreground hover:text-destructive"
            >
              ✕ Clear filter
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Status chips ── */}
      <div className="flex gap-3 mb-6  overflow-x-auto overflow-y-hidden no-scrollbar">
        {NEW_PROVIDER_STATUS_CHIPS.map((chip, i) => {
          const isActive = activeStatus === chip.id;
          const count = countForChip(chip.id);

          return (
            <motion.button
              key={chip.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveStatus(chip.id)}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-full border cursor-pointer shrink-0",
                isActive ? "bg-primary/10" : "bg-card",
              )}
            >
              <div
                className="size-2 rounded-full shrink-0 bg-destructive"
                style={{ background: chip.color }}
              />
              <span
                className="font-bold leading-none"
                style={{
                  color: isActive ? chip.color : "#f0f2f7",
                }}
              >
                {count}
              </span>
              <span
                className="text-[12.5px] font-medium"
                style={{ color: isActive ? chip.color : "#8a93a8" }}
              >
                {chip.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* ── Section header ── */}
      <div className="flex items-center justify-between mb-3.5">
        <p className="text-[11.5px] font-bold tracking-[.08em] uppercase text-muted-foreground">
          Patient Cases
        </p>
        <p className="text-[11.5px] text-muted-foreground">
          Showing {filteredPatients.length} case
          {filteredPatients.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* ── Patient cards ── */}
      <div className="flex flex-col gap-2">
        <AnimatePresence>
          {filteredPatients.map((patient, i) => (
            <PatientCard key={patient.id} patient={patient} index={i} />
          ))}
        </AnimatePresence>

        {filteredPatients.length === 0 && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-semibold" style={{ color: "#8a93a8" }}>
              No patients found
            </p>
            <p className="text-[12.5px] mt-1" style={{ color: "#555e72" }}>
              Try adjusting your filters or search query
            </p>
          </motion.div>
        )}
      </div>
    </main>
  );
}
