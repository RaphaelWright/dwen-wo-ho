import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { formatProviderName } from "@/lib/utils/shared/provider-name";
import { PartnerConfirmationOverlayHostProps } from "@/lib/types/components/curator/partners/partner-details-panel";

// The isAdding*/isRemoving* booleans drive several independent confirmation
// modals that can each be in-flight concurrently. They are intentionally kept
// as separate flags rather than a single variant union.
export const PartnerConfirmationModals = ({
  schoolToAdd,
  setSchoolToAdd,
  handleAddSchool,
  isAddingSchool,
  schoolToRemove,
  setSchoolToRemove,
  handleRemoveSchool,
  isRemovingSchool,
  providerToAdd,
  setProviderToAdd,
  handleAddProvider,
  isAddingProvider,
  providerToRemove,
  setProviderToRemove,
  handleRemoveProvider,
  isRemovingProvider,
}: PartnerConfirmationOverlayHostProps) => {
  return (
    <>
      <ConfirmationModal
        isOpen={!!schoolToAdd}
        onClose={() => setSchoolToAdd(null)}
        onConfirm={() => schoolToAdd && handleAddSchool(schoolToAdd)}
        title="Add School"
        message={`Are you sure you want to add "${schoolToAdd?.name}" to this partner?`}
        confirmText="Yes, Add"
        variant="success"
        isLoading={isAddingSchool}
      />

      <ConfirmationModal
        isOpen={!!schoolToRemove}
        onClose={() => setSchoolToRemove(null)}
        onConfirm={() => schoolToRemove && handleRemoveSchool(schoolToRemove)}
        title="Remove School"
        message={`Are you sure you want to remove "${schoolToRemove?.name}" from this partner?`}
        confirmText="Yes, Remove"
        variant="danger"
        isLoading={isRemovingSchool}
      />

      <ConfirmationModal
        isOpen={!!providerToAdd}
        onClose={() => setProviderToAdd(null)}
        onConfirm={() => providerToAdd && handleAddProvider(providerToAdd)}
        title="Add Provider"
        message={`Are you sure you want to add "${providerToAdd ? formatProviderName(providerToAdd.providerName, providerToAdd.providerTitle) : ""}" to this partner?`}
        confirmText="Yes, Add"
        variant="success"
        isLoading={isAddingProvider}
      />

      <ConfirmationModal
        isOpen={!!providerToRemove}
        onClose={() => setProviderToRemove(null)}
        onConfirm={() =>
          providerToRemove && handleRemoveProvider(providerToRemove)
        }
        title="Remove Provider"
        message={`Are you sure you want to remove "${providerToRemove ? formatProviderName(providerToRemove.providerName, providerToRemove.providerTitle) : ""}" from this partner?`}
        confirmText="Yes, Remove"
        variant="danger"
        isLoading={isRemovingProvider}
      />
    </>
  );
};
