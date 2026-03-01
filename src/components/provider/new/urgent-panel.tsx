"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NEW_PROVIDER_URGENT_PATIENTS } from "@/data/mock-provider-data";
import useNewProvider from "@/hooks/provider/use-new-provider";
import UrgentCard from "./urgent-card";

/**
 * Right-side Urgent Care panel.
 *
 * @param {{ activeSchool: string }} props
 */
export default function UrgentPanel() {
  const { activeSchool } = useNewProvider();
  const filtered = NEW_PROVIDER_URGENT_PATIENTS.filter(
    (p) => activeSchool === "all" || p.school === activeSchool,
  );

  return (
    <aside className="w-full shrink-0 flex flex-col overflow-y-auto no-scrollbar h-full border-l">
      {/* Header */}
      <div className="px-4 pt-5 pb-4 border-b shrink-0 border-muted">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[14px] font-bold">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center text-[13px] border bg-destructive/10 border-destructive">
              🚨
            </div>
            Urgent Care
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
            className="text-[10.5px] font-bold text-white px-2 py-0.5 rounded-full bg-destructive"
          >
            {filtered.length}
          </motion.span>
        </div>

        <p className="text-[11px] mt-1 text-muted-foreground">
          Across all schools · Latest first
        </p>
      </div>

      {/* Card list */}
      <ScrollArea className="flex-1 p-3">
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
              No urgent cases for this school
            </motion.p>
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}
