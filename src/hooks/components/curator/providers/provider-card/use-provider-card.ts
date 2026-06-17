"use client";
import { ProviderCardProps } from "@/lib/types/components/curator/providers/provider-card";

export const useProviderCard = ({
  provider,
  onViewDetails,
  onShowApproveModal,
  onShowRejectModal,
  isModerating,
  currentAction,
  moderatingProviderEmail,
}: ProviderCardProps) => {
  const handleApproveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShowApproveModal(provider.email);
  };

  const handleRejectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShowRejectModal(provider.email);
  };

  const handleViewDetails = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    onViewDetails(provider.email);
  };

  const isApproving =
    currentAction === "approving" && moderatingProviderEmail === provider.email;
  const isRejecting =
    currentAction === "rejecting" && moderatingProviderEmail === provider.email;

  const isActionDisabled =
    isModerating && moderatingProviderEmail === provider.email;

  return {
    handleApproveClick,
    handleRejectClick,
    handleViewDetails,
    isApproving,
    isRejecting,
    isActionDisabled,
  };
};
