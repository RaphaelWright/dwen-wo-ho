"use client";

import { m, AnimatePresence } from "motion/react";
import MainContent from "@/components/provider/new/main-content";
import UrgentPanel from "@/components/shared/urgent-panel";
import SchoolsSidebar from "@/components/provider/new/schools-side-bar";
import LiquidGlassNavbar from "@/components/ui/liquid-glass-navbar";
import LiquidGlass from "@/components/ui/liquid-glass";
import { SearchDropdown } from "@/components/shared/search-dropdown";
import { PatientSuggestionCard } from "@/components/shared/patient-suggestion-card";
import { type MobilePanel } from "@/hooks/provider/use-provider-dashboard-mobile";
import { cn } from "@/lib/utils";
import type { PatientCase } from "@/lib/types/api/patient-results";
import ProviderActivityLog from "@/components/provider/provider-activity-log";
import ProviderNavbar from "@/components/provider/new/nav-bar";
import { activateOnKeyboard } from "@/lib/utils/a11y";
import type { ProviderDashboardShellProps } from "@/lib/types/components/provider/dashboard/shell";

export default function ProviderDashboardShell({
  dashboard,
  onUrgentPatientClick,
}: ProviderDashboardShellProps) {
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

      {/* Desktop: 3-column grid */}
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
            patients={urgentData?.urgentPatients}
            activeSchool={activeSchool}
            onPatientClick={onUrgentPatientClick}
          />
        </div>
      </div>

      {/* Mobile: single panel */}
      <div
        className={cn(
          "relative flex-1 min-[1065px]:hidden",
          searchOpen ? "overflow-visible" : "overflow-hidden",
        )}
      >
        <AnimatePresence>
          {searchOpen && (
            <>
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-background/20 absolute inset-0 z-60"
                role="button"
                tabIndex={0}
                aria-label="Close search"
                onClick={() => setSearchOpen(false)}
                onKeyDown={activateOnKeyboard(() => setSearchOpen(false))}
              />
              <m.div
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -60, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="absolute top-0 right-0 left-0 z-70 h-full p-3"
                role="button"
                tabIndex={0}
                aria-label="Close search"
                onClick={() => setSearchOpen(false)}
                onKeyDown={activateOnKeyboard(() => setSearchOpen(false))}
              >
                <div
                  className="mx-auto max-w-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <LiquidGlass
                    cornerRadius={20}
                    blur={16}
                    padding="0px 0px"
                    style={{ overflow: "visible" }}
                  >
                    <SearchDropdown
                      searchQuery={searchConfig.searchQuery}
                      onSearchChange={searchConfig.setSearchQuery}
                      placeholders={["Search patients...", "Search schools"]}
                      suggestions={searchConfig.topSuggestions}
                      quickFilters={quickFilters}
                      activeFilters={searchConfig.localActiveFilters}
                      autoFocus={true}
                      fullMobileHeight={true}
                      onSelectOption={(val) => {
                        searchConfig.setSearchQuery(val);
                        setSearchOpen(false);
                      }}
                      onFilterChange={searchConfig.onFilterChange}
                      onRemoveFilter={searchConfig.removeFilter}
                      getSuggestionValue={searchConfig.getSuggestionValue}
                      renderSuggestion={(p: PatientCase) => (
                        <PatientSuggestionCard
                          name={p.patientName}
                          score={p.score ?? 0}
                          status={p.status}
                        />
                      )}
                      onSubmitSearch={searchConfig.onSubmitSearch}
                      onSuggestionAction={searchConfig.onSuggestionAction}
                      onResetSearch={() => {
                        searchConfig.onResetSearch();
                        setActiveSchool("all");
                        setActiveStatus("all");
                      }}
                    />
                  </LiquidGlass>
                </div>
              </m.div>
            </>
          )}
        </AnimatePresence>

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
                patients={urgentData?.urgentPatients}
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
          onTabChange={(id) => setActivePanel(id as MobilePanel)}
          layoutId="mobile-glass-pill"
          className="absolute!"
        />
      </div>
    </>
  );
}
