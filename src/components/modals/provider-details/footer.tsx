import { FiCheck, FiX } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { ProviderFooterProps } from "@/lib/types/components/modals/provider-details";

export const ProviderFooter = ({
  applicationStatus,
  handleApproveClick,
  handleRejectClick,
  isModerating,
  moderatingProviderEmail,
  providerEmail,
  currentAction,
  onClose,
}: ProviderFooterProps) => {
  const isTargetingThisProvider =
    isModerating && moderatingProviderEmail === providerEmail;

  return (
    <div className="border-t border-border p-6 bg-muted/40 backdrop-blur-sm">
      <div className="flex justify-between items-center gap-3">
        {applicationStatus === "PENDING" && (
          <div className="flex gap-2 flex-1">
            <Button
              onClick={handleApproveClick}
              disabled={isTargetingThisProvider}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-muted/80 text-success border hover:bg-muted rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed h-auto"
            >
              {currentAction === "approving" && isTargetingThisProvider ? (
                <>
                  <div className="w-4 h-4 border-2 border-border border-t-transparent rounded-full animate-spin" />
                  Approving...
                </>
              ) : (
                <>
                  <FiCheck className="w-4 h-4" />
                  Approve
                </>
              )}
            </Button>
            <Button
              onClick={handleRejectClick}
              disabled={isTargetingThisProvider}
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-muted/80 hover:bg-muted/50 text-destructive rounded-lg font-semibold transition-all duration-200 border border-border disabled:opacity-50 disabled:cursor-not-allowed h-auto"
            >
              {currentAction === "rejecting" && isTargetingThisProvider ? (
                <>
                  <div className="w-4 h-4 border-2 border-destructive border-t-transparent rounded-full animate-spin" />
                  Rejecting...
                </>
              ) : (
                <>
                  <FiX className="w-4 h-4" />
                  Reject
                </>
              )}
            </Button>
          </div>
        )}
        {applicationStatus === "APPROVED" && (
          <div className="flex gap-2 flex-1">
            <div className="flex-1 flex items-center justify-center gap-1 px-4 py-2.5 bg-success/50 text-success rounded-lg font-semibold text-sm border border-success">
              <FiCheck className="w-4 h-4" />
              Approved
            </div>
            <Button
              onClick={handleRejectClick}
              disabled={isTargetingThisProvider}
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-muted/80 hover:bg-muted/50 text-destructive rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed h-auto"
            >
              {currentAction === "rejecting" && isTargetingThisProvider ? (
                <>
                  <div className="w-4 h-4 border-2 border-destructive border-t-transparent rounded-full animate-spin" />
                  Rejecting...
                </>
              ) : (
                <>
                  <FiX className="w-4 h-4" />
                  Reject
                </>
              )}
            </Button>
          </div>
        )}
        {applicationStatus === "REJECTED" && (
          <div className="flex gap-2 flex-1">
            <Button
              onClick={handleApproveClick}
              disabled={isTargetingThisProvider}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-muted/80 hover:bg-muted/50 text-foreground rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed h-auto"
            >
              {currentAction === "approving" && isTargetingThisProvider ? (
                <>
                  <div className="w-4 h-4 border-2 border-border border-t-transparent rounded-full animate-spin" />
                  Approving...
                </>
              ) : (
                <>
                  <FiCheck className="w-4 h-4" />
                  Approve
                </>
              )}
            </Button>
            <div className="flex-1 flex items-center justify-center gap-1 px-4 py-2.5 bg-destructive/10 text-destructive rounded-lg font-semibold text-sm">
              <FiX className="w-4 h-4" />
              Rejected
            </div>
          </div>
        )}
        {/* <Button
          onClick={onClose}
          variant="outline"
          className="px-6 py-2.5 bg-muted/80 rounded-lg font-semibold hover:bg-muted/50 transition-colors h-auto"
        >
          Close
        </Button> */}
      </div>
    </div>
  );
};
