"use client";

import {
  ProviderDetailsModalProps,
  ProviderDetailsTab,
} from "@/lib/types/modals";
import { useProviderDetails } from "@/hooks/components/modals/provider-details";
import { ProviderHeader } from "./provider-details/header";
import { ProviderTabs } from "./provider-details/tabs";
import { OverviewTab } from "./provider-details/overview-tab";
import { SchoolsTab } from "./provider-details/schools-tab";
import { PartnersTab } from "./provider-details/partners-tab";
import { ProviderFooter } from "./provider-details/footer";
import { ProviderConfirmationModals } from "./provider-details/confirmation-modals";

const ProviderDetailsModal = ({
  isOpen,
  onClose,
  providerEmail,
  provider: providerProp,
  onShowApproveModal,
  onShowRejectModal,
  isModerating = false,
  currentAction = null,
  moderatingProviderEmail = null,
}: ProviderDetailsModalProps) => {
  const {
    provider,
    isQueryLoading,
    activeTab,
    setActiveTab,
    associatedSchools,
    filteredAvailableSchools,
    associatedPartners,
    filteredAvailablePartners,
    schoolSearchQuery,
    setSchoolSearchQuery,
    partnerSearchQuery,
    setPartnerSearchQuery,
    isLoadingSchools,
    isLoadingPartners,
    showApproveModal,
    setShowApproveModal,
    showRejectModal,
    setShowRejectModal,
    handleAddSchool,
    handleRemoveSchool,
    handleAddPartner,
    handleRemovePartner,
    handleApproveClick,
    handleRejectClick,
    handleApproveConfirm,
    handleRejectConfirm,
    setSchoolToAdd,
    setSchoolToRemove,
    setPartnerToAdd,
    setPartnerToRemove,
    schoolToAdd,
    schoolToRemove,
    partnerToAdd,
    partnerToRemove,
    isAddingSchool,
    isRemovingSchool,
    isAddingPartner,
    isRemovingPartner,
    applicationStatusConfig,
  } = useProviderDetails({
    isOpen,
    providerEmail,
    providerProp,
    onShowApproveModal,
    onShowRejectModal,
  });

  const showLoading = isQueryLoading && !provider;

  return (
    <>
      <div
        className={`fixed inset-0 backdrop-blur-sm bg-background/80 flex items-center justify-center z-50 p-4 transition-all duration-300 ease-in-out ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      >
        <div
          className={`relative bg-card text-foreground rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-border transition-all duration-300 ease-in-out ${
            isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {provider && applicationStatusConfig && (
            <ProviderHeader
              provider={provider}
              onClose={onClose}
              statusConfig={applicationStatusConfig}
            />
          )}

          <ProviderTabs
            activeTab={activeTab}
            setActiveTab={(tab) => setActiveTab(tab as ProviderDetailsTab)}
            associatedSchoolsCount={associatedSchools.length}
            associatedPartnersCount={associatedPartners.length}
          />

          <div className="flex-1 overflow-y-auto px-6 pb-6">
            {showLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-muted-foreground font-medium">
                  Loading provider details...
                </p>
              </div>
            ) : (
              <>
                {activeTab === "overview" && provider && (
                  <OverviewTab provider={provider} />
                )}

                {activeTab === "schools" && (
                  <SchoolsTab
                    isLoadingSchools={isLoadingSchools}
                    associatedSchools={associatedSchools}
                    schoolSearchQuery={schoolSearchQuery}
                    setSchoolSearchQuery={setSchoolSearchQuery}
                    filteredAvailableSchools={filteredAvailableSchools}
                    setSchoolToRemove={setSchoolToRemove}
                    setSchoolToAdd={setSchoolToAdd}
                    applicationStatus={provider?.applicationStatus}
                  />
                )}

                {activeTab === "partners" && (
                  <PartnersTab
                    isLoadingPartners={isLoadingPartners}
                    associatedPartners={associatedPartners}
                    partnerSearchQuery={partnerSearchQuery}
                    setPartnerSearchQuery={setPartnerSearchQuery}
                    filteredAvailablePartners={filteredAvailablePartners}
                    setPartnerToRemove={setPartnerToRemove}
                    setPartnerToAdd={setPartnerToAdd}
                  />
                )}
              </>
            )}
          </div>

          <ProviderFooter
            applicationStatus={provider?.applicationStatus}
            handleApproveClick={handleApproveClick}
            handleRejectClick={handleRejectClick}
            isModerating={isModerating}
            moderatingProviderEmail={moderatingProviderEmail}
            providerEmail={providerEmail}
            currentAction={currentAction}
            onClose={onClose}
          />
        </div>
      </div>

      <ProviderConfirmationModals
        schoolToAdd={schoolToAdd}
        setSchoolToAdd={setSchoolToAdd}
        handleAddSchool={handleAddSchool}
        isAddingSchool={isAddingSchool}
        schoolToRemove={schoolToRemove}
        setSchoolToRemove={setSchoolToRemove}
        handleRemoveSchool={handleRemoveSchool}
        isRemovingSchool={isRemovingSchool}
        partnerToAdd={partnerToAdd}
        setPartnerToAdd={setPartnerToAdd}
        handleAddPartner={handleAddPartner}
        partnerToRemove={partnerToRemove}
        setPartnerToRemove={setPartnerToRemove}
        handleRemovePartner={handleRemovePartner}
        isAddingPartner={isAddingPartner}
        isRemovingPartner={isRemovingPartner}
        providerName={provider?.fullName}
        showApproveModal={showApproveModal}
        setShowApproveModal={setShowApproveModal}
        handleApproveConfirm={handleApproveConfirm}
        showRejectModal={showRejectModal}
        setShowRejectModal={setShowRejectModal}
        handleRejectConfirm={handleRejectConfirm}
        currentAction={currentAction}
      />
    </>
  );
};

export default ProviderDetailsModal;
