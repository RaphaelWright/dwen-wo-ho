import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { SignInFooterProps } from "@/lib/types/components/patient/signin";
import { SIGN_IN_TEXTS } from "@/lib/constants/components/patient/signin";

export function SignInFooter({ onBack, isLoading, errors }: SignInFooterProps) {
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="flex border-t border-gray-500 px-10 pt-10 items-center justify-between">
      <Button
        onClick={onBack}
        className="rounded-full px-6 py-6 border-4 bg-background text-primary text-xl font-bold border-primary uppercase hover:bg-muted"
      >
        {SIGN_IN_TEXTS.footer.back}
      </Button>
      <Button
        form="login-form"
        type="submit"
        disabled={isLoading || hasErrors}
        className={`text-xl px-8 py-3 border-4 font-bold rounded-md flex items-center gap-2 transition-colors ${
          isLoading || hasErrors
            ? "border-muted text-muted-foreground bg-muted-foreground/20 cursor-not-allowed"
            : "border-primary text-primary-foreground bg-primary/60 hover:bg-primary/80"
        }`}
      >
        {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
        {isLoading
          ? SIGN_IN_TEXTS.footer.signingIn
          : SIGN_IN_TEXTS.footer.signIn}
      </Button>
    </div>
  );
}
