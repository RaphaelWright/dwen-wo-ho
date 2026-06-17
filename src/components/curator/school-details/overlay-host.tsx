"use client";

import SchoolEditPanel from "@/components/curator/schools/school-edit-panel";
import ProviderDetailsPanel from "@/components/curator/providers/provider-details-panel";
import AddIconWizard from "@/components/curator/content-pages/overlays/add-icon-wizard";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import type { SchoolDetailsOverlayHostProps } from "@/lib/types/components/curator/school-details/school-details";
import type { CuratorSchoolDetailsState } from "@/hooks/curator/school-details/use-school-details";

export default function SchoolDetailsModals({
  details,
}: SchoolDetailsOverlayHostProps<CuratorSchoolDetailsState>) {
  const {
    school,
    showEditModal,
    setShowEditModal,
    showDisableModal,
    setShowDisableModal,
    showProviderModal,
    setShowProviderModal,
    selectedProviderEmail,
    showAddIconWizard,
    setShowAddIconWizard,
    editingIcon,
    setEditingIcon,
    handleSchoolUpdated,
    handleDisableSchool,
    handleDisableConfirm,
    handleIconComplete,
    loadProviders,
    isActionLoading,
    selectedProvider,
  } = details;

  return (
    <>
      {school && (
        <>
          <SchoolEditPanel
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

      <ProviderDetailsPanel
        isOpen={showProviderModal}
        onClose={() => {
          setShowProviderModal(false);
          loadProviders();
        }}
        providerEmail={selectedProviderEmail}
        provider={selectedProvider}
      />

      <AddIconWizard
        isOpen={showAddIconWizard}
        onClose={() => {
          setShowAddIconWizard(false);
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
    </>
  );
}
