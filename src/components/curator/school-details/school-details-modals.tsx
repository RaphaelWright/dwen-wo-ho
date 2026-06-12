"use client";

import SchoolEditModal from "@/components/modals/school-edit";
import ProviderDetailsModal from "@/components/modals/provider-details";
import AddIconModal from "@/components/modals/add-icon";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import type { SchoolDetailsModalsProps } from "@/lib/types/components/curator/school-details-modals";

export default function SchoolDetailsModals({
  details,
}: SchoolDetailsModalsProps) {
  const {
    school,
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
    </>
  );
}
