"use client";
import type { Route } from "next";

import SchoolEditModal from "@/components/modals/school-edit";
import ProviderDetailsModal from "@/components/modals/provider-details";
import AddIconModal from "@/components/modals/add-icon";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
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
import { formatUrgentCarePatients } from "@/lib/utils/formatUrgentCarePatients";
import { motion } from "framer-motion";
import { PatientSuggestionCard } from "@/components/shared/patient-suggestion-card";

export default function SchoolDetailsPage() {
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
    isActionLoading,
    error,
    activeTab,
    searchQuery,
    setSearchQuery,
    showEditModal,
    setShowEditModal,
    showDisableModal,
    setShowDisableModal,
    showProviderModal,
    setShowProviderModal,
    selectedProviderEmail,
    showAddIconModal,
    setShowAddIconModal,
    editingIcon,
    setEditingIcon,
    handleProviderClick,
    handleSchoolUpdated,
    handleDisableSchool,
    handleDisableConfirm,
    handleIconComplete,
    compactTimeAgo,
    loadProviders,
    suggestions,
    quickFilters,
    tabs,
    handleTabChange,
    selectedProvider,
  } = useCuratorSchoolDetails();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/5">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">
            Loading school details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !school) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-muted/5">
        <Button
          onClick={() => router.push(ROUTES.curator.schools)}
          variant="ghost"
          className="mb-3 text-muted-foreground hover:text-foreground"
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
    <div className="min-h-screen flex flex-col bg-primary/10 animate-in fade-in duration-500">
      <div className="flex-1 flex flex-col lg:flex-row items-start relative w-full">
        {/* Main content */}
        <div className="flex-1 min-w-0 w-full flex flex-col px-4 py-6 sm:px-6 relative z-10">
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ x: -4 }}
            onClick={() => router.push(ROUTES.curator.schools)}
            className="group mb-6 flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground w-fit"
          >
            <ChevronLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
            Back to Schools
          </motion.button>

          <SchoolHeaderCard
            school={school}
            campusLabel={campusLabel}
            onEditClick={() => setShowEditModal(true)}
            onDisableClick={handleDisableSchool}
            searchComponent={
              <div className="flex items-center gap-3 w-full md:max-w-110">
                <div className="hidden md:block lg:max-w-xs 2xl:max-w-md ml-auto flex-1">
                  <SearchDropdown
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    placeholders={SCHOOL_DETAILS_SEARCH_PLACEHOLDERS[activeTab]}
                    suggestions={suggestions}
                    quickFilters={quickFilters}
                    onSelectOption={(val) => {
                      setSearchQuery(val);
                    }}
                    getSuggestionValue={(s) => s.name}
                    renderSuggestion={PatientSuggestionCard}
                  />
                </div>
              </div>
            }
          />

          <div className="grid gap-4 mb-4">
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
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20 rounded-xl"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Add Icon
                  </Button>
                ) : null
              }
              className="2xl:mb-8 z-0"
              activeTabLayoutId="school-details-filter"
            />
            <div className="md:hidden max-w-md">
              <SearchDropdown
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                placeholders={SCHOOL_DETAILS_SEARCH_PLACEHOLDERS[activeTab]}
                suggestions={suggestions}
                quickFilters={quickFilters}
                onSelectOption={(val) => {
                  setSearchQuery(val);
                }}
                getSuggestionValue={(s) => s.name}
                renderSuggestion={PatientSuggestionCard}
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
                searchQuery={searchQuery}
                onViewPatient={(patientId) =>
                  router.push(DYNAMIC_ROUTES.curator.patientDetails(schoolId, patientId) as Route)
                }
              />
            )}

            {activeTab === "icons" && (
              <div className="p-4 sm:p-6">
                <IconsTab
                  icons={schoolIcons}
                  searchQuery={searchQuery}
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
                  searchQuery={searchQuery}
                  onProviderClick={handleProviderClick}
                />
              </div>
            )}
          </div>
        </div>

        {/* Urgent Care Sidebar */}
        <UrgentPanel
          className="w-full lg:w-95 h-dvh lg:h-screen lg:sticky lg:top-0 border-l border-border/50 bg-destructive/5 shrink-0"
          patients={formatUrgentCarePatients(
            urgentCare.patients.filter(
              (p) => p.lockedInScore && p.lockedInScore <= 4,
            ),
            school?.name,
            compactTimeAgo,
          )}
          title="Urgent Care"
          emptyStateText="No urgent care patients"
        />
      </div>

      {/* Modals */}
      {school && (
        <>
          <SchoolEditModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            school={school}
            onSchoolUpdated={handleSchoolUpdated}
            onDisableSchool={handleDisableSchool}
          />
          <ConfirmationModal
            isOpen={showDisableModal}
            onClose={() => setShowDisableModal(false)}
            onConfirm={handleDisableConfirm}
            title="Disable School"
            message={`Are you sure you want to disable ${school.name}? This cannot be undone.`}
            confirmText="Yes, Disable"
            variant="danger"
            isLoading={isActionLoading}
          />
        </>
      )}

      <ProviderDetailsModal
        isOpen={showProviderModal}
        onClose={() => {
          setShowProviderModal(false);
          loadProviders();
        }}
        providerEmail={selectedProviderEmail}
        provider={selectedProvider}
      />

      <AddIconModal
        isOpen={showAddIconModal}
        onClose={() => {
          setShowAddIconModal(false);
          setEditingIcon(null);
        }}
        onComplete={handleIconComplete}
        editData={
          editingIcon
            ? {
                photoPreview: editingIcon.photoPreview,
                name: editingIcon.name,
                slogan: editingIcon.slogan,
                rank: editingIcon.rank,
                lockIns: editingIcon.lockIns || [],
              }
            : null
        }
        selectedSchool={school}
      />
    </div>
  );
}
