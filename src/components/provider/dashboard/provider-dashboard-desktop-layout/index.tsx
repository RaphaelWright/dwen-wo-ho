"use client";

import MainContent from "@/components/provider/workspace/main-content/index";
import UrgentPanel from "@/components/shared/urgent-panel/index";
import SchoolsSidebar from "@/components/provider/workspace/schools-side-bar/index";
import type { ProviderDashboardDesktopLayoutProps } from "@/lib/types/components/provider/dashboard/desktop-layout";

export function ProviderDashboardDesktopLayout({
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
}: ProviderDashboardDesktopLayoutProps) {
  return (
    <div className="hidden h-full w-full grid-cols-[18%_60%_22%] overflow-hidden min-[1065px]:grid">
      <div className="h-full overflow-hidden">
        <SchoolsSidebar
          activeSchool={activeSchool}
          handleSelectSchool={handleSelectSchool}
          schools={schools}
          totalPatientCount={totalPatientCount}
          isLoading={isInitLoading}
        />
      </div>
      <div className="h-full overflow-hidden">
        <MainContent
          activeStatus={activeStatus}
          setActiveStatus={setActiveStatus}
          filteredPatients={filteredPatients}
          countForChip={countForChip}
          isLoading={isInitLoading}
        />
      </div>
      <div className="h-full overflow-hidden">
        <UrgentPanel
          patients={urgentPatients}
          activeSchool={activeSchool}
          onPatientClick={onUrgentPatientClick}
        />
      </div>
    </div>
  );
}
