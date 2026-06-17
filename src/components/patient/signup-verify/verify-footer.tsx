import { Button } from "@/components/ui/button";
import Stepper from "@/components/miscellaneous/stepper";
import { SIGNUP_STEPS as signUpSteps } from "@/lib/constants/mock-data";
import { VerifyFooterProps } from "@/lib/types/components/patient/onboarding";
import { SIGNUP_VERIFY_TEXTS } from "@/lib/constants/components/patient/auth-copy";

export function VerifyFooter({ onBack }: VerifyFooterProps) {
  return (
    <div className="flex items-center justify-between border-t border-gray-500 px-10 pt-5">
      <Button
        onClick={onBack}
        className="bg-background text-primary border-primary hover:bg-muted rounded-full border-4 px-6 text-xl font-bold uppercase transition-colors"
      >
        {SIGNUP_VERIFY_TEXTS.footer.back}
      </Button>
      <Stepper
        steps={signUpSteps}
        step={SIGNUP_VERIFY_TEXTS.footer.step as (typeof signUpSteps)[number]}
      />
      <Button className="bg-background text-primary border-primary invisible rounded-full border-4 px-6 text-xl font-bold uppercase">
        {SIGNUP_VERIFY_TEXTS.footer.next}
      </Button>
    </div>
  );
}
