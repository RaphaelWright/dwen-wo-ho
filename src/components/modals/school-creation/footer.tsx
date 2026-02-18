import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SchoolFooterProps } from "@/lib/types/components/modals/school-creation";

export const SchoolFooter = ({
  currentStep,
  handleClose,
  handleNext,
  handleBack,
  handleConfirm,
  isFormValid,
  isPending,
}: SchoolFooterProps) => {
  return (
    <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/50 flex justify-between gap-3">
      {currentStep === 1 ? (
        <>
          <Button
            type="button"
            onClick={handleClose}
            variant="ghost"
            className="px-6 font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleNext}
            disabled={!isFormValid}
            className="px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="px-6 font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Edit
          </Button>
          <div className="flex gap-3">
            <Button
              type="button"
              onClick={handleClose}
              variant="ghost"
              className="px-6 font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              disabled={isPending}
              className="px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Confirm & Create
                </>
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
