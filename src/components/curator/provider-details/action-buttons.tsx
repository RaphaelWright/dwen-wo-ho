import { CheckCircle, XCircle } from "lucide-react";
import { LoadingButton } from "@/components/ui/loading-button";
import { ProviderActionButtonsProps } from "@/lib/types/components/curator/provider-details/provider-details";

export function ProviderActionButtons({
  onApprove,
  onReject,
  isLoading,
}: ProviderActionButtonsProps) {
  return (
    <div className="bg-card border-border overflow-hidden rounded-lg border shadow-lg">
      <div className="px-6 py-6">
        <h2 className="text-foreground mb-4 text-xl font-bold">
          Review Actions
        </h2>
        <div className="flex space-x-4">
          <LoadingButton
            onClick={onApprove}
            loading={isLoading}
            loadingText="Approving..."
            className="bg-success hover:bg-success/90 text-primary-foreground flex items-center space-x-2 px-6 py-3"
          >
            <CheckCircle className="h-5 w-5" />
            <span>Approve Provider</span>
          </LoadingButton>
          <LoadingButton
            onClick={onReject}
            loading={isLoading}
            loadingText="Rejecting..."
            variant="destructive"
            className="flex items-center space-x-2 px-6 py-3"
          >
            <XCircle className="h-5 w-5" />
            <span>Reject Provider</span>
          </LoadingButton>
        </div>
      </div>
    </div>
  );
}
