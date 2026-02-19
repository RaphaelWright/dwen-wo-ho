import { Button } from "@/components/ui/button";
import Stepper from "@/components/miscellaneous/stepper";
import { recoverSteps } from "@/lib/utils";
import { NewPasswordFooterProps } from "@/lib/types/components/patient/new-password";
import { NEW_PASSWORD_TEXTS } from "@/lib/constants/components/patient/new-password";
import { ArrowLeft, Check } from "lucide-react";

export function NewPasswordFooter({ onBack }: NewPasswordFooterProps) {
  return (
    <div className="flex border-t border-border/50 px-6 sm:px-10 py-4 items-center justify-between w-full bg-background/50 backdrop-blur-sm">
      <Button
        onClick={onBack}
        variant="outline"
        className="rounded-full px-5 h-9 text-sm font-semibold gap-1.5 hover:bg-primary/5 hover:text-primary transition-colors border-primary/20 hover:border-primary/50"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {NEW_PASSWORD_TEXTS.footer.back}
      </Button>

      <div className="scale-90 sm:scale-100">
        <Stepper
          steps={recoverSteps}
          step={NEW_PASSWORD_TEXTS.footer.step as any}
        />
      </div>

      <Button
        form="login-form"
        type="submit"
        className="rounded-full px-5 h-9 text-sm font-semibold gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-md transition-all"
      >
        {NEW_PASSWORD_TEXTS.footer.done}
        <Check className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
