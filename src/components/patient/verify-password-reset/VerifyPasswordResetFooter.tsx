import { Button } from "@/components/ui/button";
import Stepper from "@/components/miscellaneous/stepper";
import { recoverSteps } from "@/lib/utils";
import { VerifyPasswordResetFooterProps } from "@/lib/types/components/patient/verify-password-reset";
import { VERIFY_PASSWORD_RESET_TEXTS } from "@/lib/constants/components/patient/verify-password-reset";

export function VerifyPasswordResetFooter({
  onBack,
}: VerifyPasswordResetFooterProps) {
  return (
    <div className="flex border-t border-gray-500 px-10 pt-5 items-center justify-between">
      <Button
        onClick={onBack}
        className="rounded-full px-6 border-4 bg-background text-primary text-xl font-bold border-primary uppercase hover:bg-muted transition-colors"
      >
        {VERIFY_PASSWORD_RESET_TEXTS.footer.back}
      </Button>
      <Stepper
        steps={recoverSteps}
        step={VERIFY_PASSWORD_RESET_TEXTS.footer.step as any}
      />
      <Button className="invisible rounded-full px-6 border-4 bg-background text-primary text-xl font-bold border-primary uppercase">
        {VERIFY_PASSWORD_RESET_TEXTS.footer.next}
      </Button>
    </div>
  );
}
