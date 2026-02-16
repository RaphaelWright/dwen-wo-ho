import { Button } from "@/components/ui/button";
import Stepper from "@/components/miscellaneous/stepper";
import { recoverSteps } from "@/lib/utils";
import { NewPasswordFooterProps } from "@/lib/types/components/patient/new-password";
import { NEW_PASSWORD_TEXTS } from "@/lib/constants/components/patient/new-password";
import { Input } from "@/components/ui/input";

export function NewPasswordFooter({ onBack }: NewPasswordFooterProps) {
  return (
    <div className="flex border-t border-gray-500 px-10 pt-10 items-center justify-between">
      <Button
        onClick={onBack}
        className="none rounded-full px-6 border-4 bg-white text-[#955aa4] text-xl font-bold border-[#955aa4] uppercase"
      >
        {NEW_PASSWORD_TEXTS.footer.back}
      </Button>
      <Stepper
        steps={recoverSteps}
        step={NEW_PASSWORD_TEXTS.footer.step as any}
      />
      <Input
        form="login-form"
        type="submit"
        value={NEW_PASSWORD_TEXTS.footer.done}
        className="text-xl px-7 py-1 border-4 font-bold border-[#955aa4] rounded-full text-white bg-[#955aa4]/50"
      />
    </div>
  );
}
