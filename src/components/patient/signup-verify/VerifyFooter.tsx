import { Button } from "@/components/ui/button";
import Stepper from "@/components/miscellaneous/stepper";
import { signUpSteps } from "@/lib/utils";
import { VerifyFooterProps } from "@/lib/types/components/patient/signup-verify";
import { SIGNUP_VERIFY_TEXTS } from "@/lib/constants/components/patient/signup-verify";

export function VerifyFooter({ onBack }: VerifyFooterProps) {
  return (
    <div className="flex border-t border-gray-500 px-10 pt-5 items-center justify-between">
      <Button
        onClick={onBack}
        className="rounded-full px-6 border-4 bg-white text-[#955aa4] text-xl font-bold border-[#955aa4] uppercase"
      >
        {SIGNUP_VERIFY_TEXTS.footer.back}
      </Button>
      <Stepper
        steps={signUpSteps}
        step={SIGNUP_VERIFY_TEXTS.footer.step as any}
      />
      <Button className="invisible rounded-full px-6 border-4 bg-white text-[#955aa4] text-xl font-bold border-[#955aa4] uppercase">
        {SIGNUP_VERIFY_TEXTS.footer.next}
      </Button>
    </div>
  );
}
