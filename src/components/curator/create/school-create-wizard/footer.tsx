import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { SchoolCreateFooterProps } from "@/lib/types/components/curator/create/create";

export const SchoolFooter = ({
  currentStep,
  handleClose,
  handleNext,
  handleBack,
  handleConfirm,
  isFormValid,
  isPending,
}: SchoolCreateFooterProps) => {
  return (
    <div className="border-border bg-muted/30 flex justify-between gap-3 border-t px-8 py-6">
      {currentStep === 1 ? (
        <>
          <Button
            type="button"
            onClick={handleClose}
            variant="ghost"
            className="px-6"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleNext}
            disabled={!isFormValid}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20 px-8 font-semibold shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next: Review
          </Button>
        </>
      ) : (
        <>
          <Button
            type="button"
            onClick={handleBack}
            variant="ghost"
            className="flex items-center gap-2 px-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Edit
          </Button>
          <div className="flex gap-3">
            <Button
              type="button"
              onClick={handleClose}
              variant="ghost"
              className="px-6"
            >
              Cancel
            </Button>
            <LoadingButton
              type="button"
              onClick={handleConfirm}
              loading={isPending}
              loadingText="Creating..."
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20 px-8 font-semibold shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
              Confirm & Create
            </LoadingButton>
          </div>
        </>
      )}
    </div>
  );
};
