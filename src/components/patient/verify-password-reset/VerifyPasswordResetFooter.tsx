import { Button } from "@/components/ui/button";
import Stepper from "@/components/miscellaneous/stepper";
import { recoverSteps } from "@/lib/utils";
import { VerifyPasswordResetFooterProps } from "@/lib/types/components/patient/verify-password-reset";
import { VERIFY_PASSWORD_RESET_TEXTS } from "@/lib/constants/components/patient/verify-password-reset";
import { ArrowLeft } from "lucide-react";

export function VerifyPasswordResetFooter({
  onBack,
}: VerifyPasswordResetFooterProps) {
  return (
    <div className="flex border-t border-border/50 px-6 sm:px-10 py-4 items-center justify-between w-full bg-background/50 backdrop-blur-sm">
      <Button
        onClick={onBack}
        variant="outline"
        className="rounded-full px-5 h-9 text-sm font-semibold gap-1.5 hover:bg-primary/5 hover:text-primary transition-colors border-primary/20 hover:border-primary/50"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {VERIFY_PASSWORD_RESET_TEXTS.footer.back}
      </Button>
      <div className="scale-90 sm:scale-100">
        <Stepper
          steps={recoverSteps}
          step={
            VERIFY_PASSWORD_RESET_TEXTS.footer.step as (typeof recoverSteps)[number]
          }
        />
      </div>
      <div className="w-22 sm:w-25" />{" "}
      {/* Spacer to balance flex layout since next button is invisible */}
    </div>
  );
}
