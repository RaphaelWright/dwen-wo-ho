"use client";

import { useState } from "react";
import { useProvidersQuery } from "@/hooks/queries/use-provider";

export const useProviderPanelState = (
  providerEmail: string,
  onShowApproveModal?: (email: string) => void,
  onShowRejectModal?: (email: string) => void,
) => {
  const { approveProvider, rejectProvider } = useProvidersQuery({
    enabled: false,
  });
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const handleApproveClick = () => {
    if (onShowApproveModal) {
      onShowApproveModal(providerEmail);
    } else {
      setShowApproveModal(true);
    }
  };

  const handleRejectClick = () => {
    if (onShowRejectModal) {
      onShowRejectModal(providerEmail);
    } else {
      setShowRejectModal(true);
    }
  };

  const handleApproveConfirm = () => {
    setShowApproveModal(false);
    approveProvider(providerEmail);
  };

  const handleRejectConfirm = () => {
    setShowRejectModal(false);
    rejectProvider(providerEmail);
  };

  return {
    showApproveModal,
    setShowApproveModal,
    showRejectModal,
    setShowRejectModal,
    handleApproveClick,
    handleRejectClick,
    handleApproveConfirm,
    handleRejectConfirm,
  };
};
