import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { ArrowLeft } from "lucide-react";
import { SignInFooterProps } from "@/lib/types/components/patient/signin";
import { SIGN_IN_TEXTS } from "@/lib/constants/components/patient/signin";

export function SignInFooter({ onBack, isLoading, errors }: SignInFooterProps) {
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="border-border/50 flex items-center justify-between border-t px-8 pt-6 pb-2">
      <Button
        onClick={onBack}
        variant="outline"
        className="border-border hover:bg-muted hover:border-primary/30 gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 hover:shadow-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        {SIGN_IN_TEXTS.footer.back}
      </Button>
      <LoadingButton
        form="login-form"
        type="submit"
        loading={isLoading}
        loadingText={SIGN_IN_TEXTS.footer.signingIn}
        disabled={hasErrors}
        className={`rounded-full px-8 py-2.5 text-sm font-semibold shadow-md transition-all duration-200 ${
          isLoading || hasErrors
            ? "bg-muted text-muted-foreground cursor-not-allowed shadow-none"
            : "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-primary/25 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
        }`}
      >
        {SIGN_IN_TEXTS.footer.signIn}
      </LoadingButton>
    </div>
  );
}
