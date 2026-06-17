"use client";

import ProviderNavbar from "@/components/provider/workspace/nav-bar/index";
import { cn } from "@/lib/utils";
import type { ProviderDashboardShellProps } from "@/lib/types/components/provider/dashboard/dashboard";
import type { ProviderDashboardState } from "@/hooks/provider/dashboard/use-dashboard";
import { ProviderDashboardDesktopLayout } from "../provider-dashboard-desktop-layout";
import { ProviderDashboardMobileSearchOverlay } from "../provider-dashboard-mobile-search-overlay";
import { ProviderDashboardMobilePanels } from "../provider-dashboard-mobile-panels";

export default function ProviderDashboardShell({
  dashboard,
  onUrgentPatientClick,
}: ProviderDashboardShellProps<ProviderDashboardState>) {
  const {
    setActiveSchool,
    setActiveStatus,
    quickFilters,
    activeSchool,
    handleSelectSchool,
    schools,
    filteredPatients,
    totalPatientCount,
    activeStatus,
    countForChip,
    profileData,
    unreadCount,
    setProfileOpen,
    setNotifOpen,
    theme,
    searchConfig,
    isInitLoading,
    activePanel,
    setActivePanel,
    searchOpen,
    setSearchOpen,
    mobileTabs,
    panelVariants,
    panelTransition,
    urgentData,
  } = dashboard;

  return (
    <>
      <ProviderNavbar
        searchOpen={searchOpen}
        setSearchOpen={setSearchOpen}
        profileData={profileData}
        unreadCount={unreadCount}
        setProfileOpen={setProfileOpen}
        setNotifOpen={setNotifOpen}
        theme={theme}
        searchConfig={searchConfig}
        quickFilters={quickFilters}
      />

      <ProviderDashboardDesktopLayout
        activeSchool={activeSchool}
        handleSelectSchool={handleSelectSchool}
        schools={schools}
        totalPatientCount={totalPatientCount}
        isInitLoading={isInitLoading}
        activeStatus={activeStatus}
        setActiveStatus={setActiveStatus}
        filteredPatients={filteredPatients}
        countForChip={countForChip}
        urgentPatients={urgentData?.urgentPatients}
        onUrgentPatientClick={onUrgentPatientClick}
      />

      <div
        className={cn(
          "relative flex-1 min-[1065px]:hidden",
          searchOpen ? "overflow-visible" : "overflow-hidden",
        )}
      >
        <ProviderDashboardMobileSearchOverlay
          searchOpen={searchOpen}
          setSearchOpen={setSearchOpen}
          searchConfig={searchConfig}
          quickFilters={quickFilters}
          setActiveSchool={setActiveSchool}
          setActiveStatus={setActiveStatus}
        />

        <ProviderDashboardMobilePanels
          activePanel={activePanel}
          panelVariants={panelVariants}
          panelTransition={panelTransition}
          activeSchool={activeSchool}
          handleSelectSchool={handleSelectSchool}
          schools={schools}
          totalPatientCount={totalPatientCount}
          isInitLoading={isInitLoading}
          activeStatus={activeStatus}
          setActiveStatus={setActiveStatus}
          filteredPatients={filteredPatients}
          countForChip={countForChip}
          urgentPatients={urgentData?.urgentPatients}
          onUrgentPatientClick={onUrgentPatientClick}
          mobileTabs={mobileTabs}
          setActivePanel={setActivePanel}
        />
      </div>
    </>
  );
}
