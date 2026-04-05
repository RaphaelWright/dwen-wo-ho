"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  LayoutGrid,
  Search,
  Sparkles,
  UserRoundX,
  X,
  Zap,
} from "lucide-react";
import { NEW_PROVIDER_STATUS_CHIPS } from "@/lib/constants/components/provider/dashboard";

import PatientCard from "@/components/shared/patient-card";
import type { ProviderDashboardState } from "@/hooks/provider/use-provider-dashboard";
import { FilterTabBar } from "@/components/shared/filter-tab-bar";
import { ProviderDashboardSkeleton } from "./provider-dashboard-skeleton";

const STATUS_TAB_ICONS: Record<string, typeof LayoutGrid> = {
  all: LayoutGrid,
  new: Sparkles,
  action: Zap,
};

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
export default function MainContent({
  activeStatus,
  setActiveStatus,
  filteredPatients,
  countForChip,
  isLoading,
}: {
  activeStatus: ProviderDashboardState["activeStatus"];
  setActiveStatus: ProviderDashboardState["setActiveStatus"];
  filteredPatients: ProviderDashboardState["filteredPatients"];
  countForChip: ProviderDashboardState["countForChip"];
  isLoading?: boolean;
}) {
  // Show skeleton during initial loading
  if (isLoading) {
    return <ProviderDashboardSkeleton />;
  }
  return (
    <main className="h-full overflow-y-auto no-scrollbar px-2 py-6 pb-40 md:pb-10 lg:ml-4">
      {/* ── Status filter tabs ── */}
      <FilterTabBar
        tabs={NEW_PROVIDER_STATUS_CHIPS.map((chip) => ({
          key: chip.id,
          label: chip.label,
          icon: STATUS_TAB_ICONS[chip.id] ?? LayoutGrid,
          count: countForChip(chip.id),
        }))}
        activeTab={activeStatus}
        onTabChange={setActiveStatus}
        showCount={true}
        className="mb-6 mx-auto min-[640px]:w-fit"
        activeTabLayoutId="provider-main-status-filter"
      />

      {/* ── Patient cards ── */}
      <div className="flex flex-col gap-2">
        <AnimatePresence>
          {filteredPatients.map((patient, i) => (
            <PatientCard
              key={
                patient.patientId != null && patient.patientId !== 0
                  ? `patient-${patient.patientId}`
                  : `idx-${i}`
              }
              patient={patient}
              index={i}
              detailRoute={(id) => `/provider/patients/${id}`}
            />
          ))}
        </AnimatePresence>

        {filteredPatients.length === 0 && (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex flex-col items-center justify-center py-10 px-6"
          >
            <div className="relative mb-6">
              <div className="absolute inset-0 blur-2xl opacity-20 bg-linear-to-br from-violet-500/40 to-cyan-500/40 rounded-full" />
              <div className="relative w-20 h-20 rounded-full bg-linear-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center shadow-lg shadow-slate-200/30 dark:shadow-slate-900/30">
                <UserRoundX
                  className="w-9 h-9 text-slate-400 dark:text-slate-500"
                  strokeWidth={1.5}
                />
              </div>
            </div>
            <p className="font-semibold text-lg text-slate-800 dark:text-slate-200">
              No patients found
            </p>
            <p className="text-sm mt-1.5 text-slate-500 dark:text-slate-400 max-w-xs text-center leading-relaxed">
              Try adjusting your filters or search query to find what you're
              looking for
            </p>
          </motion.div>
        )}
      </div>
    </main>
  );
}
