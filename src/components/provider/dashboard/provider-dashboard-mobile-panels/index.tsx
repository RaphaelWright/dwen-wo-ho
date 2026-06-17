"use client";

import { m, AnimatePresence } from "motion/react";
import MainContent from "@/components/provider/workspace/main-content/index";
import UrgentPanel from "@/components/shared/urgent-panel/index";
import SchoolsSidebar from "@/components/provider/workspace/schools-side-bar/index";
import LiquidGlassNavbar from "@/components/ui/liquid-glass-navbar";
import ProviderActivityLog from "@/components/provider/provider-activity-log/index";
import type { ProviderDashboardMobilePanelsProps } from "@/lib/types/components/provider/dashboard/desktop-layout";

export function ProviderDashboardMobilePanels({
  activePanel,
  panelVariants,
  panelTransition,
  activeSchool,
  handleSelectSchool,
  schools,
  totalPatientCount,
  isInitLoading,
  activeStatus,
  setActiveStatus,
  filteredPatients,
  countForChip,
  urgentPatients,
  onUrgentPatientClick,
  mobileTabs,
  setActivePanel,
}: ProviderDashboardMobilePanelsProps) {
  return (
    <>
      <AnimatePresence mode="wait">
        {activePanel === "schools" && (
          <m.div
            key="schools"
            variants={panelVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={panelTransition}
            className="absolute inset-0 h-screen overflow-y-auto"
          >
            <SchoolsSidebar
              activeSchool={activeSchool}
              handleSelectSchool={handleSelectSchool}
              schools={schools}
              totalPatientCount={totalPatientCount}
              isLoading={isInitLoading}
            />
          </m.div>
        )}
        {activePanel === "patients" && (
          <m.div
            key="patients"
            variants={panelVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={panelTransition}
            className="absolute inset-0 h-screen overflow-hidden"
          >
            <MainContent
              activeStatus={activeStatus}
              setActiveStatus={setActiveStatus}
              filteredPatients={filteredPatients}
              countForChip={countForChip}
              isLoading={isInitLoading}
            />
          </m.div>
        )}
        {activePanel === "urgent" && (
          <m.div
            key="urgent"
            variants={panelVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={panelTransition}
            className="absolute inset-0 h-screen overflow-y-auto"
          >
            <UrgentPanel
              patients={urgentPatients}
              activeSchool={activeSchool}
              isLoading={isInitLoading}
              onPatientClick={onUrgentPatientClick}
            />
          </m.div>
        )}
        {activePanel === "activity" && (
          <m.div
            key="activity"
            variants={panelVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={panelTransition}
            className="bg-background absolute inset-0 h-screen overflow-y-auto"
          >
            <ProviderActivityLog />
          </m.div>
        )}
      </AnimatePresence>

      <LiquidGlassNavbar
        tabs={mobileTabs}
        activeTab={activePanel}
        onTabChange={(id) =>
          setActivePanel(
            id as ProviderDashboardMobilePanelsProps["activePanel"],
          )
        }
        layoutId="mobile-glass-pill"
        className="absolute!"
      />
    </>
  );
}
