"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Filter, LayoutGrid, Search, Sparkles, X, Zap } from "lucide-react";
import { NEW_PROVIDER_STATUS_CHIPS } from "@/data/mock-provider-data";
import PatientCard from "@/components/shared/patient-card";
import useProviderDashboard from "@/hooks/provider/useProviderDashboard";
import { FilterTabBar } from "@/components/shared/filter-tab-bar";

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
export default function MainContent() {
  const { activeStatus, setActiveStatus, countForChip, filteredPatients } =
    useProviderDashboard();

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
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(filteredPatients as any[]).map((patient, i) => (
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
            <p className="text-4xl mb-3">
              <Search />
            </p>
            <p className="font-semibold">No patients found</p>
            <p className="text-[12.5px] mt-1">
              Try adjusting your filters or search query
            </p>
          </motion.div>
        )}
      </div>
    </main>
  );
}
