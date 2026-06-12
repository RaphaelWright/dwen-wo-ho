"use client";

import { usePartnerDetails } from "@/hooks/components/modals/use-partner-details";
import ProviderDetailsModal from "./provider-details";
import SchoolEditModal from "./school-edit";
import { PartnerDetailsModalProps } from "@/lib/types/modals";

// Sub-components
import { PartnerHeader } from "./partner-details/header";
import { PartnerTabs } from "./partner-details/tabs";
import { OverviewTab } from "./partner-details/overview-tab";
import { SchoolsTab } from "./partner-details/schools-tab";
import { ProvidersTab } from "./partner-details/providers-tab";
import { PartnerConfirmationModals } from "./partner-details/confirmation-modals";

const PartnerDetailsModal = ({
  isOpen,
  onClose,
  partnerId,
  partner: partnerProp,
}: PartnerDetailsModalProps) => {
  const {
    partner,
    activeTab,
    setActiveTab,
    associatedSchools,
    associatedProviders,
    schoolSearchQuery,
    setSchoolSearchQuery,
    providerSearchQuery,
    setProviderSearchQuery,
    schoolToAdd,
    setSchoolToAdd,
    schoolToRemove,
    setSchoolToRemove,
    providerToAdd,
    setProviderToAdd,
    providerToRemove,
    setProviderToRemove,
    isLoadingSchools,
    isLoadingProviders,
    isAddingSchool,
    isRemovingSchool,
    isAddingProvider,
    isRemovingProvider,
    showProviderModal,
    setShowProviderModal,
    selectedProviderEmail,
    showSchoolModal,
    setShowSchoolModal,
    selectedSchool,
    setSelectedSchool,
    filteredAvailableSchools,
    filteredAvailableProviders,
    handleAddSchool,
    handleRemoveSchool,
    handleAddProvider,
    handleRemoveProvider,
    loadPartnerDetails,
    handleSchoolClick,
    handleProviderClick,
    tabs,
  } = usePartnerDetails({ partnerId: String(partnerId), partnerProp, isOpen });

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
          <PartnerHeader partner={partner} onClose={onClose} />

          <PartnerTabs
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8">
            {activeTab === "overview" && <OverviewTab partner={partner} />}

            {activeTab === "schools" && (
              <SchoolsTab
                isLoadingSchools={isLoadingSchools}
                associatedSchools={associatedSchools}
                filteredAvailableSchools={filteredAvailableSchools}
                schoolSearchQuery={schoolSearchQuery}
                setSchoolSearchQuery={setSchoolSearchQuery}
                handleSchoolClick={handleSchoolClick}
                setSchoolToRemove={setSchoolToRemove}
                setSchoolToAdd={setSchoolToAdd}
              />
            )}

            {activeTab === "providers" && (
              <ProvidersTab
                isLoadingProviders={isLoadingProviders}
                associatedProviders={associatedProviders}
                filteredAvailableProviders={filteredAvailableProviders}
                providerSearchQuery={providerSearchQuery}
                setProviderSearchQuery={setProviderSearchQuery}
                handleProviderClick={handleProviderClick}
                setProviderToRemove={setProviderToRemove}
                setProviderToAdd={setProviderToAdd}
              />
            )}
          </div>
        </div>
      </div>

      <PartnerConfirmationModals
        schoolToAdd={schoolToAdd}
        setSchoolToAdd={setSchoolToAdd}
        handleAddSchool={handleAddSchool}
        isAddingSchool={isAddingSchool}
        schoolToRemove={schoolToRemove}
        setSchoolToRemove={setSchoolToRemove}
        handleRemoveSchool={handleRemoveSchool}
        isRemovingSchool={isRemovingSchool}
        providerToAdd={providerToAdd}
        setProviderToAdd={setProviderToAdd}
        handleAddProvider={handleAddProvider}
        isAddingProvider={isAddingProvider}
        providerToRemove={providerToRemove}
        setProviderToRemove={setProviderToRemove}
        handleRemoveProvider={handleRemoveProvider}
        isRemovingProvider={isRemovingProvider}
      />

      {/* Provider Details Modal */}
      {showProviderModal && (
        <ProviderDetailsModal
          isOpen={showProviderModal}
          onClose={() => setShowProviderModal(false)}
          providerEmail={selectedProviderEmail}
        />
      )}

      {/* School Edit Modal (used for viewing details) */}
      {showSchoolModal && selectedSchool && (
        <SchoolEditModal
          isOpen={showSchoolModal}
          onClose={() => {
            setShowSchoolModal(false);
            setSelectedSchool(null);
          }}
          school={selectedSchool}
          onSchoolUpdated={async () => {
            await loadPartnerDetails();
            setShowSchoolModal(false);
            setSelectedSchool(null);
          }}
        />
      )}
    </>
  );
};

export default PartnerDetailsModal;
