import { Button } from "@/components/ui/button";
import { CheckEmailFormProps } from "@/lib/types/components/patient/check-email";
import { CHECK_EMAIL_TEXTS } from "@/lib/constants/components/patient/auth-copy";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowRight, AlertCircle } from "lucide-react";

export function CheckEmailForm({
  register,
  handleSubmit,
  onSubmit,
  errors,
  isValidEmail,
  onEmailChange,
}: CheckEmailFormProps) {
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="animate-in fade-in slide-in-from-bottom-6 w-full max-w-xl delay-300 duration-700"
    >
      <div className="flex flex-col gap-3">
        <Label className="text-foreground/70 pl-1 text-sm font-semibold">
          {CHECK_EMAIL_TEXTS.form.emailLabel}
        </Label>
        <div className="group dark:bg-input/50 border-border/30 focus-within:border-primary/40 relative flex items-center gap-1 rounded-2xl border shadow-lg backdrop-blur-md transition-all duration-300 focus-within:shadow-[0_0_24px_rgba(126,34,206,0.1)]">
          <Input
            {...register("email")}
            onChange={(e) => {
              register("email").onChange(e);
              onEmailChange(e);
            }}
            placeholder={CHECK_EMAIL_TEXTS.form.emailPlaceholder}
            className="text-foreground placeholder:text-muted-foreground/40 h-auto w-full rounded-2xl border-none bg-transparent p-4 text-base font-medium shadow-none md:text-lg"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!isValidEmail}
            className={`mr-2 size-9 shrink-0 rounded-full transition-all duration-300 md:size-10 ${
              isValidEmail
                ? "bg-primary hover:bg-primary/90 hover:shadow-primary/25 shadow-md hover:scale-105 hover:shadow-lg"
                : "bg-muted text-muted-foreground cursor-not-allowed opacity-30"
            }`}
          >
            <ArrowRight
              className={`size-4 md:size-5 ${isValidEmail ? "text-primary-foreground" : ""}`}
            />
          </Button>
        </div>
        {errors?.email?.message && (
          <div className="animate-in slide-in-from-top-1 fade-in flex items-center gap-1.5 pl-1 duration-200">
            <AlertCircle className="text-destructive h-3.5 w-3.5 shrink-0" />
            <p className="text-destructive text-sm font-medium">
              {errors.email.message}
            </p>
          </div>
        )}
      </div>
    </form>
  );
}
