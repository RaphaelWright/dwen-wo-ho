"use client";

import type { Route } from "next";
import type { UrgentPatient } from "@/components/shared/urgent-card";
import { ROUTES, DYNAMIC_ROUTES } from "@/lib/constants/routes";
import { useCuratorSchoolDetails } from "@/hooks/curator/use-curator-school-details";
import {
  SchoolHeaderCard,
  PatientsTab,
  IconsTab,
  UrgentPanel,
  ProvidersTab,
} from "@/components/curator/school-details";
import { Button } from "@/components/ui/button";
import { FilterTabBar } from "@/components/shared/filter-tab-bar";
import { SearchDropdown } from "@/components/shared/search-dropdown";
import { SCHOOL_DETAILS_SEARCH_PLACEHOLDERS } from "@/lib/constants/components/curator/school-details";
import type { SchoolTab } from "@/lib/types/components/curator/school-details";
import { Users, ChevronLeft } from "lucide-react";
import { m } from "motion/react";
import { PatientSuggestionCard } from "@/components/shared/patient-suggestion-card";
import { SchoolSuggestionCard } from "@/components/shared/school-suggestion-card";
import SchoolDetailsModals from "@/components/curator/school-details/school-details-modals";

export default function SchoolDetailsPage() {
  const details = useCuratorSchoolDetails();
  const {
    router,
    schoolId,
    school,
    patients,
    providers,
    icons: schoolIcons,
    urgentCare,
    campusLabel,
    isLoading,
    patientsLoading,
    providersLoading,
    error,
    activeTab,
    searchQuery,
    setSearchQuery,
    appliedSearchQuery,
    setAppliedSearchQuery,
    setShowEditModal,
    handleDisableSchool,
    setShowAddIconModal,
    setEditingIcon,
    handleProviderClick,
    compactTimeAgo,
    suggestions,
    quickFilters,
    tabs,
    handleTabChange,
    localActiveFilters,
    toggleFilter,
    removeFilter,
    clearFilters,
  } = details;

  if (isLoading) {
    return (
      <div className="bg-muted/5 flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-b-2" />

          <p className="text-muted-foreground text-sm">
            Loading school details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !school) {
    return (
      <div className="bg-muted/5 flex min-h-screen flex-col items-center justify-center p-6">
        <Button
          onClick={() => router.push(ROUTES.curator.schools)}
          variant="ghost"
          className="text-muted-foreground hover:text-foreground mb-3"
        >
          ← Back to Schools
        </Button>

        <p className="text-destructive text-sm">
          {error || "School not found"}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-primary/10 animate-in fade-in flex min-h-screen flex-col duration-500">
      <div className="relative flex w-full flex-1 flex-col items-start lg:flex-row">
        {/* Main content */}

        <div className="relative z-10 flex w-full min-w-0 flex-1 flex-col px-4 py-6 sm:px-6">
          <m.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ x: -4 }}
            onClick={() => router.push(ROUTES.curator.schools)}
            className="group text-muted-foreground hover:text-foreground mb-6 flex w-fit items-center gap-2 text-sm font-medium transition-colors"
          >
            <ChevronLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
            Back to Schools
          </m.button>

          <SchoolHeaderCard
            school={school}
            campusLabel={campusLabel}
            onEditClick={() => setShowEditModal(true)}
            onDisableClick={handleDisableSchool}
            // searchComponent={
            //   <div className="flex items-center gap-3 w-full md:max-w-110">
            //     <div className="hidden md:block lg:max-w-xs 2xl:max-w-md ml-auto flex-1">
            //       <SearchDropdown
            //         searchQuery={searchQuery}
            //         onSearchChange={setSearchQuery}
            //         placeholders={SCHOOL_DETAILS_SEARCH_PLACEHOLDERS[activeTab]}
            //         suggestions={suggestions}
            //         quickFilters={quickFilters}
            //         activeFilters={localActiveFilters}
            //         onSelectOption={(val) => {
            //           setSearchQuery(val);
            //         }}
            //         onFilterChange={(filter) => {
            //           if (filter.filterKey) {
            //             toggleFilter(filter);
            //           }
            //         }}
            //         onRemoveFilter={removeFilter}
            //         getSuggestionValue={(s) => s.name}
            //         renderSuggestion={(props: any) =>
            //           activeTab === "icons" ? (
            //             <SchoolSuggestionCard {...props} />
            //           ) : (
            //             <PatientSuggestionCard {...props} />
            //           )
            //         }
            //         onSubmitSearch={(query) => setAppliedSearchQuery(query)}
            //         onSuggestionAction={(suggestion) => {
            //           if (activeTab === "patients" && suggestion.id) {
            //             router.push(
            //               DYNAMIC_ROUTES.curator.patientDetails(
            //                 schoolId,
            //                 suggestion.id,
            //               ) as Route,
            //             );
            //           } else if (
            //             activeTab === "providers" &&
            //             suggestion.email
            //           ) {
            //             handleProviderClick(suggestion);
            //           } else if (activeTab === "icons") {
            //             setEditingIcon(suggestion);
            //             setShowAddIconModal(true);
            //           }
            //         }}
            //         onResetSearch={() => {
            //           setSearchQuery("");
            //           setAppliedSearchQuery("");
            //           clearFilters();
            //         }}
            //       />
            //     </div>
            //   </div>
            // }
          />

          <div className="grid gap-4 md:grid-cols-2">
            <FilterTabBar<SchoolTab>
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              renderActions={(tab) =>
                tab === "icons" ? (
                  <Button
                    onClick={() => {
                      setEditingIcon(null);

                      setShowAddIconModal(true);
                    }}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20 rounded-xl shadow-md"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Add Icon
                  </Button>
                ) : null
              }
              className="z-0 2xl:mb-8"
              activeTabLayoutId="school-details-filter"
            />

            <div className="max-w-full">
              <SearchDropdown
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                placeholders={SCHOOL_DETAILS_SEARCH_PLACEHOLDERS[activeTab]}
                suggestions={suggestions}
                quickFilters={quickFilters}
                activeFilters={localActiveFilters}
                onSelectOption={(val) => {
                  setSearchQuery(val);
                }}
                onFilterChange={(filter) => {
                  if (filter.filterKey) {
                    toggleFilter(filter);
                  }
                }}
                onRemoveFilter={removeFilter}
                getSuggestionValue={(s) => s.name}
                renderSuggestion={(suggestion) =>
                  activeTab === "icons" ? (
                    <SchoolSuggestionCard
                      name={suggestion.name}
                      avatarUrl={suggestion.avatarUrl}
                      type={suggestion.type}
                      slogan={suggestion.slogan}
                      rank={suggestion.rank}
                    />
                  ) : (
                    <PatientSuggestionCard
                      name={suggestion.name}
                      score={suggestion.score ?? 0}
                      status={suggestion.status ?? ""}
                    />
                  )
                }
                onSubmitSearch={(query) => setAppliedSearchQuery(query)}
                onSuggestionAction={(suggestion) => {
                  if (activeTab === "patients" && suggestion.id) {
                    router.push(
                      DYNAMIC_ROUTES.curator.patientDetails(
                        schoolId,
                        suggestion.id,
                      ) as Route,
                    );
                  } else if (activeTab === "providers" && suggestion.email) {
                    handleProviderClick({ email: suggestion.email });
                  } else if (activeTab === "icons" && suggestion.id != null) {
                    const icon = schoolIcons.find(
                      (i) => String(i.id) === String(suggestion.id),
                    );
                    if (icon) {
                      setEditingIcon(icon);
                      setShowAddIconModal(true);
                    }
                  }
                }}
                onResetSearch={() => {
                  setSearchQuery("");
                  setAppliedSearchQuery("");
                  clearFilters();
                }}
              />
            </div>
          </div>

          {/* Content Area */}

          <div className="overflow-hidden">
            {activeTab === "patients" && (
              <PatientsTab
                patients={patients}
                isLoading={patientsLoading}
                schoolId={schoolId}
                schoolName={school?.nickname}
                compactTimeAgo={compactTimeAgo}
                searchQuery={appliedSearchQuery}
                onViewPatient={(patientId) =>
                  router.push(
                    DYNAMIC_ROUTES.curator.patientDetails(
                      schoolId,
                      patientId,
                    ) as Route,
                  )
                }
              />
            )}

            {activeTab === "icons" && (
              <div className="p-4 sm:p-6">
                <IconsTab
                  icons={schoolIcons}
                  searchQuery={appliedSearchQuery}
                  onIconClick={(icon) => {
                    setEditingIcon(icon);
                    setShowAddIconModal(true);
                  }}
                  onAddFirstIcon={() => {
                    setEditingIcon(null);
                    setShowAddIconModal(true);
                  }}
                />
              </div>
            )}

            {activeTab === "providers" && (
              <div className="p-4 sm:p-6">
                <ProvidersTab
                  providers={providers}
                  isLoading={providersLoading}
                  searchQuery={appliedSearchQuery}
                  onProviderClick={handleProviderClick}
                />
              </div>
            )}
          </div>
        </div>

        {/* Urgent Care Sidebar */}

        <UrgentPanel
          className="border-border/50 bg-destructive/5 h-dvh w-full shrink-0 border-l lg:sticky lg:top-0 lg:h-screen lg:w-95"
          patients={urgentCare.patients}
          title="Urgent Care"
          emptyStateText="No urgent care patients"
          onPatientClick={(patient: UrgentPatient) =>
            router.push(
              DYNAMIC_ROUTES.curator.patientDetails(
                schoolId,
                patient.patientResultId,
              ) as Route,
            )
          }
        />
      </div>

      <SchoolDetailsModals details={details} />
    </div>
  );
}
