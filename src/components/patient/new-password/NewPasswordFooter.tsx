import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import Stepper from "@/components/miscellaneous/stepper";
import { recoverSteps } from "@/lib/utils";
import { NewPasswordFooterProps } from "@/lib/types/components/patient/new-password";
import { NEW_PASSWORD_TEXTS } from "@/lib/constants/components/patient/new-password";
import { ArrowLeft, Check } from "lucide-react";

export function NewPasswordFooter({
  onBack,
  isSubmitting,
}: NewPasswordFooterProps) {
  return (
    <div className="border-border/50 bg-background/50 flex w-full items-center justify-between border-t px-6 py-4 backdrop-blur-sm sm:px-10">
      <Button
        onClick={onBack}
        variant="outline"
        className="hover:bg-primary/5 hover:text-primary border-primary/20 hover:border-primary/50 h-9 gap-1.5 rounded-full px-5 text-sm font-semibold transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {NEW_PASSWORD_TEXTS.footer.back}
      </Button>

      <div className="scale-90 sm:scale-100">
        <Stepper
          steps={recoverSteps}
          step={NEW_PASSWORD_TEXTS.footer.step as (typeof recoverSteps)[number]}
        />
      </div>

      <LoadingButton
        form="login-form"
        type="submit"
        loading={isSubmitting}
        loadingText={NEW_PASSWORD_TEXTS.footer.submitting}
        className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 gap-1.5 rounded-full px-5 text-sm font-semibold shadow-sm transition-all hover:shadow-md"
      >
        {NEW_PASSWORD_TEXTS.footer.done}
        <Check className="h-3.5 w-3.5" />
      </LoadingButton>
    </div>
  );
}
