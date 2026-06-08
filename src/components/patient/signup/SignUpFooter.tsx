import { Button } from "@/components/ui/button";
import Stepper from "@/components/miscellaneous/stepper";
import { signUpSteps } from "@/lib/utils";
import { SignUpFooterProps } from "@/lib/types/components/patient/signup";
import { SIGN_UP_TEXTS } from "@/lib/constants/components/patient/signup";
import { Input } from "@/components/ui/input";

export function SignUpFooter({ onBack }: SignUpFooterProps) {
  return (
    <div className="flex border-t border-gray-500 px-10 pt-10 items-center justify-between">
      <Button
        onClick={onBack}
        className="rounded-full px-6 border-4 bg-background text-primary text-xl font-bold border-primary uppercase hover:bg-muted transition-colors"
      >
        {SIGN_UP_TEXTS.footer.back}
      </Button>
      <Stepper
        steps={signUpSteps}
        step={SIGN_UP_TEXTS.footer.step as (typeof signUpSteps)[number]}
      />
      <Input
        form="login-form"
        type="submit"
        value={SIGN_UP_TEXTS.footer.next}
        className="text-xl px-6 py-2 border-4 font-bold border-primary rounded-md text-primary-foreground bg-primary/50 cursor-pointer hover:bg-primary/70 transition-colors"
      />
    </div>
  );
}
