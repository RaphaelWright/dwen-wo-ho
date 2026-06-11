"use client";

import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { ProviderConfirmationModalsProps } from "@/lib/types/components/modals/provider-details";

// The isAdding*/isRemoving*/show* booleans drive several independent
// confirmation modals that can each be in-flight concurrently. They are
// intentionally kept as separate flags rather than a single variant union.
export const ProviderConfirmationModals = ({
  schoolToAdd,
  setSchoolToAdd,
  handleAddSchool,
  isAddingSchool,
  schoolToRemove,
  setSchoolToRemove,
  handleRemoveSchool,
  isRemovingSchool,
  partnerToAdd,
  setPartnerToAdd,
  handleAddPartner,
  partnerToRemove,
  setPartnerToRemove,
  handleRemovePartner,
  isAddingPartner,
  isRemovingPartner,
  providerName,
  showApproveModal,
  setShowApproveModal,
  handleApproveConfirm,
  showRejectModal,
  setShowRejectModal,
  handleRejectConfirm,
  currentAction,
}: ProviderConfirmationModalsProps) => {
  return (
    <>
      {/* Add School Confirmation Modal */}
      <ConfirmationModal
        isOpen={schoolToAdd !== null}
        onClose={() => !isAddingSchool && setSchoolToAdd(null)}
        onConfirm={() => schoolToAdd && handleAddSchool(schoolToAdd)}
        title="Add School Confirmation"
        message={`Are you sure you want to add ${schoolToAdd?.name} to ${providerName || "this provider"}?`}
        confirmText="Yes, Add School"
        variant="success"
        isLoading={isAddingSchool}
      />

      {/* Remove School Confirmation Modal */}
      <ConfirmationModal
        isOpen={schoolToRemove !== null}
        onClose={() => !isRemovingSchool && setSchoolToRemove(null)}
        onConfirm={() => schoolToRemove && handleRemoveSchool(schoolToRemove)}
        title="Remove School Confirmation"
        message={`Are you sure you want to remove ${schoolToRemove?.name} from ${providerName || "this provider"}?`}
        confirmText="Yes, Remove School"
        variant="danger"
        isLoading={isRemovingSchool}
      />

      {/* Add Partner Confirmation Modal */}
      <ConfirmationModal
        isOpen={partnerToAdd !== null}
        onClose={() => !isAddingPartner && setPartnerToAdd(null)}
        onConfirm={() => partnerToAdd && handleAddPartner(partnerToAdd)}
        title="Add Partner Confirmation"
        message={`Are you sure you want to add ${partnerToAdd?.name} to ${providerName || "this provider"}?`}
        confirmText="Yes, Add Partner"
        variant="success"
        isLoading={isAddingPartner}
      />

      {/* Remove Partner Confirmation Modal */}
      <ConfirmationModal
        isOpen={partnerToRemove !== null}
        onClose={() => !isRemovingPartner && setPartnerToRemove(null)}
        onConfirm={() =>
          partnerToRemove && handleRemovePartner(partnerToRemove)
        }
        title="Remove Partner Confirmation"
        message={`Are you sure you want to remove ${partnerToRemove?.name} from ${providerName || "this provider"}?`}
        confirmText="Yes, Remove Partner"
        variant="danger"
        isLoading={isRemovingPartner}
      />

      {/* Approve Provider Confirmation Modal */}
      <ConfirmationModal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        onConfirm={handleApproveConfirm}
        title="Approve Provider Confirmation"
        message={`Are you sure you want to approve ${providerName || "this provider"} as a provider?`}
        confirmText="Yes, Approve"
        variant="success"
        isLoading={currentAction === "approving"}
      />

      {/* Reject Provider Confirmation Modal */}
      <ConfirmationModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleRejectConfirm}
        title="Reject Provider Confirmation"
        message={`Are you sure you want to reject ${providerName || "this provider"}'s provider application?`}
        confirmText="Yes, Reject"
        variant="danger"
        isLoading={currentAction === "rejecting"}
      />
    </>
  );
};
