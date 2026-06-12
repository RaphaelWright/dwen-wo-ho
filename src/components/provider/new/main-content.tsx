"use client";

import { m, AnimatePresence } from "motion/react";
import { LayoutGrid, Sparkles, UserRoundX, Zap } from "lucide-react";
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
    <main className="no-scrollbar h-full overflow-y-auto px-2 py-6 pb-40 md:pb-10 lg:ml-4">
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
        className="mx-auto mb-6 min-[640px]:w-fit"
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
              showCheckbox={false}
            />
          ))}
        </AnimatePresence>

        {filteredPatients.length === 0 && (
          <m.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex flex-col items-center justify-center px-6 py-10"
          >
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full bg-linear-to-br from-violet-500/40 to-cyan-500/40 opacity-20 blur-2xl" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-slate-200/60 bg-linear-to-br from-slate-100 to-slate-50 shadow-lg shadow-slate-200/30 dark:border-slate-700/60 dark:from-slate-800 dark:to-slate-900 dark:shadow-slate-900/30">
                <UserRoundX
                  className="h-9 w-9 text-slate-400 dark:text-slate-500"
                  strokeWidth={1.5}
                />
              </div>
            </div>
            <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">
              No patients found
            </p>
            <p className="mt-1.5 max-w-xs text-center text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Try adjusting your filters or search query to find what
              you&apos;re looking for
            </p>
          </m.div>
        )}
      </div>
    </main>
  );
}
