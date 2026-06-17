import { Button } from "@/components/ui/button";
import Stepper from "@/components/miscellaneous/stepper";
import { SIGNUP_STEPS as signUpSteps } from "@/lib/constants/mock-data";
import { SignUpFooterProps } from "@/lib/types/components/patient/signup";
import { SIGN_UP_TEXTS } from "@/lib/constants/components/patient/auth-copy";
import { Input } from "@/components/ui/input";

export function SignUpFooter({ onBack }: SignUpFooterProps) {
  return (
    <div className="flex items-center justify-between border-t border-gray-500 px-10 pt-10">
      <Button
        onClick={onBack}
        className="bg-background text-primary border-primary hover:bg-muted rounded-full border-4 px-6 text-xl font-bold uppercase transition-colors"
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
        className="border-primary text-primary-foreground bg-primary/50 hover:bg-primary/70 cursor-pointer rounded-md border-4 px-6 py-2 text-xl font-bold transition-colors"
      />
    </div>
  );
}
