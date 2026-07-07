import { Button } from "@/components/ui/button";
import Stepper from "@/components/miscellaneous/stepper";
import { RECOVER_STEPS as recoverSteps } from "@/lib/constants/components/shared/auth-flow";
import { VerifyPasswordResetFooterProps } from "@/lib/types/components/patient/verify-password-reset";
import { VERIFY_PASSWORD_RESET_TEXTS } from "@/lib/constants/components/patient/auth-copy";
import { IoArrowBackOutline } from "react-icons/io5";

export function VerifyPasswordResetFooter({
  onBack,
}: VerifyPasswordResetFooterProps) {
  return (
    <div className="border-border/50 bg-background/50 flex w-full items-center justify-between gap-3 border-t px-0 py-3 backdrop-blur-sm sm:px-10 sm:py-4">
      <Button
        onClick={onBack}
        variant="outline"
        className="hover:bg-primary/5 hover:text-primary border-primary/20 hover:border-primary/50 h-9 shrink-0 gap-1.5 rounded-full px-4 text-sm font-semibold transition-colors sm:px-5"
      >
        <IoArrowBackOutline className="h-3.5 w-3.5" />
        {VERIFY_PASSWORD_RESET_TEXTS.footer.back}
      </Button>
      <div className="min-w-0 scale-[0.85] overflow-x-auto sm:scale-100">
        <Stepper
          steps={recoverSteps}
          step={
            VERIFY_PASSWORD_RESET_TEXTS.footer
              .step as (typeof recoverSteps)[number]
          }
        />
      </div>
      <div className="hidden w-22 sm:block sm:w-25" />{" "}
      {/* Spacer to balance flex layout since next button is invisible */}
    </div>
  );
}
