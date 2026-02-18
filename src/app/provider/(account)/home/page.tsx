"use client";

import PendingVerificationModal from "@/components/modals/pending-verification";
import { useProviderHome } from "@/hooks/provider/useProviderHome";
import { ProviderHomeLoading } from "@/components/provider/home";

const ProviderHomePage = () => {
  const { userInfo, showPendingModal, isLoading, isApproved } =
    useProviderHome();

  // Show pending modal if not approved (no "Coming Soon" text)
  if (!isApproved && !isLoading) {
    return (
      <PendingVerificationModal
        isOpen={showPendingModal}
        isLoading={isLoading && !showPendingModal}
        onClose={() => {
          // Prevent closing to enforce pending state view
        }}
        userInfo={userInfo}
      />
    );
  }

  // Show loading state while checking approval status
  return <ProviderHomeLoading />;
};

export default ProviderHomePage;
