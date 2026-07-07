import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import Stepper from "@/components/miscellaneous/stepper";
import { RECOVER_STEPS as recoverSteps } from "@/lib/constants/components/shared/auth-flow";
import { NewPasswordFooterProps } from "@/lib/types/components/patient/new-password";
import { NEW_PASSWORD_TEXTS } from "@/lib/constants/components/patient/auth-copy";
import { IoArrowBackOutline, IoCheckmarkOutline } from "react-icons/io5";

export function NewPasswordFooter({
  onBack,
  isSubmitting,
}: NewPasswordFooterProps) {
  return (
    <div className="border-border/50 bg-background/50 grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-t px-0 py-3 backdrop-blur-sm sm:px-10 sm:py-4">
      <Button
        onClick={onBack}
        variant="outline"
        className="hover:bg-primary/5 hover:text-primary border-primary/20 hover:border-primary/50 h-9 shrink-0 gap-1.5 rounded-full px-4 text-sm font-semibold transition-colors sm:px-5"
      >
        <IoArrowBackOutline className="h-3.5 w-3.5" />
        {NEW_PASSWORD_TEXTS.footer.back}
      </Button>

      <div className="min-w-0 scale-[0.85] overflow-x-auto sm:scale-100">
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
        className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 shrink-0 gap-1.5 rounded-full px-4 text-sm font-semibold shadow-sm transition-all hover:shadow-md sm:px-5"
      >
        {NEW_PASSWORD_TEXTS.footer.done}
        <IoCheckmarkOutline className="h-3.5 w-3.5" />
      </LoadingButton>
    </div>
  );
}
