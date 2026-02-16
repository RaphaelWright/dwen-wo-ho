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
    <div className="border-t border-gray-200 p-6 bg-gray-50">
      <div className="flex justify-between items-center gap-3">
        {applicationStatus === "PENDING" && (
          <div className="flex gap-2 flex-1">
            <Button
              onClick={handleApproveClick}
              disabled={isTargetingThisProvider}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-black hover:bg-gray-900 text-white rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed h-auto"
            >
              {currentAction === "approving" && isTargetingThisProvider ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-red-600 rounded-lg font-semibold transition-all duration-200 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed h-auto"
            >
              {currentAction === "rejecting" && isTargetingThisProvider ? (
                <>
                  <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
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
            <div className="flex-1 flex items-center justify-center gap-1 px-4 py-2.5 bg-green-100 text-green-700 rounded-lg font-semibold text-sm border border-green-200">
              <FiCheck className="w-4 h-4" />
              Approved
            </div>
            <Button
              onClick={handleRejectClick}
              disabled={isTargetingThisProvider}
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-red-600 rounded-lg font-semibold transition-all duration-200 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed h-auto"
            >
              {currentAction === "rejecting" && isTargetingThisProvider ? (
                <>
                  <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
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
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-black hover:bg-gray-900 text-white rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed h-auto"
            >
              {currentAction === "approving" && isTargetingThisProvider ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Approving...
                </>
              ) : (
                <>
                  <FiCheck className="w-4 h-4" />
                  Approve
                </>
              )}
            </Button>
            <div className="flex-1 flex items-center justify-center gap-1 px-4 py-2.5 bg-red-100 text-red-700 rounded-lg font-semibold text-sm border border-red-200">
              <FiX className="w-4 h-4" />
              Rejected
            </div>
          </div>
        )}
        <Button
          onClick={onClose}
          variant="outline"
          className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors h-auto"
        >
          Close
        </Button>
      </div>
    </div>
  );
};
