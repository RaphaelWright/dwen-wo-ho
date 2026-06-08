"use client";

import { FiCheck, FiX } from "react-icons/fi";
import { LoadingButton } from "@/components/ui/loading-button";
import { ProviderFooterProps } from "@/lib/types/components/modals/provider-details";

export const ProviderFooter = ({
  applicationStatus,
  handleApproveClick,
  handleRejectClick,
  isModerating,
  moderatingProviderEmail,
  providerEmail,
  currentAction,
}: ProviderFooterProps) => {
  const isTargetingThisProvider =
    isModerating && moderatingProviderEmail === providerEmail;
  const isApproving =
    currentAction === "approving" && isTargetingThisProvider;
  const isRejecting =
    currentAction === "rejecting" && isTargetingThisProvider;

  return (
    <div className="border-t border-border p-6 bg-muted/40 backdrop-blur-sm">
      <div className="flex justify-between items-center gap-3">
        {applicationStatus === "PENDING" && (
          <div className="flex gap-2 flex-1">
            <LoadingButton
              onClick={handleApproveClick}
              loading={isApproving}
              loadingText="Approving..."
              disabled={isTargetingThisProvider && !isApproving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-muted/80 text-success border hover:bg-muted rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed h-auto"
            >
              <FiCheck className="w-4 h-4" />
              Approve
            </LoadingButton>
            <LoadingButton
              onClick={handleRejectClick}
              loading={isRejecting}
              loadingText="Rejecting..."
              disabled={isTargetingThisProvider && !isRejecting}
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-muted/80 hover:bg-muted/50 text-destructive rounded-lg font-semibold transition-all duration-200 border border-border disabled:opacity-50 disabled:cursor-not-allowed h-auto"
            >
              <FiX className="w-4 h-4" />
              Reject
            </LoadingButton>
          </div>
        )}
        {applicationStatus === "APPROVED" && (
          <div className="flex gap-2 flex-1">
            <div className="flex-1 flex items-center justify-center gap-1 px-4 py-2.5 bg-success/50 text-success rounded-lg font-semibold text-sm border border-success">
              <FiCheck className="w-4 h-4" />
              Approved
            </div>
            <LoadingButton
              onClick={handleRejectClick}
              loading={isRejecting}
              loadingText="Rejecting..."
              disabled={isTargetingThisProvider && !isRejecting}
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-muted/80 hover:bg-muted/50 text-destructive rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed h-auto"
            >
              <FiX className="w-4 h-4" />
              Reject
            </LoadingButton>
          </div>
        )}
        {applicationStatus === "REJECTED" && (
          <div className="flex gap-2 flex-1">
            <LoadingButton
              onClick={handleApproveClick}
              loading={isApproving}
              loadingText="Approving..."
              disabled={isTargetingThisProvider && !isApproving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-muted/80 hover:bg-muted/50 text-foreground rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed h-auto"
            >
              <FiCheck className="w-4 h-4" />
              Approve
            </LoadingButton>
            <div className="flex-1 flex items-center justify-center gap-1 px-4 py-2.5 bg-destructive/10 text-destructive rounded-lg font-semibold text-sm">
              <FiX className="w-4 h-4" />
              Rejected
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
