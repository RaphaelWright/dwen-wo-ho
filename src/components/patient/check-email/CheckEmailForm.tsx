import { Button } from "@/components/ui/button";
import { CheckEmailFormProps } from "@/lib/types/components/patient/check-email";
import { CHECK_EMAIL_TEXTS } from "@/lib/constants/components/patient/check-email";
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
      className="w-full max-w-xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300"
    >
      <div className="flex flex-col gap-3">
        <Label className="text-sm font-semibold text-foreground/70 pl-1">
          {CHECK_EMAIL_TEXTS.form.emailLabel}
        </Label>
        <div className="group relative flex items-center gap-1 rounded-2xl dark:bg-input/50 backdrop-blur-md border border-border/30 shadow-lg transition-all duration-300 focus-within:border-primary/40 focus-within:shadow-[0_0_24px_rgba(126,34,206,0.1)]">
          <Input
            {...register("email")}
            onChange={(e) => {
              register("email").onChange(e);
              onEmailChange(e);
            }}
            placeholder={CHECK_EMAIL_TEXTS.form.emailPlaceholder}
            className="font-medium w-full border-none shadow-none text-base md:text-lg p-4 text-foreground placeholder:text-muted-foreground/40 h-auto rounded-2xl bg-transparent"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!isValidEmail}
            className={`mr-2 rounded-full size-9 md:size-10 shrink-0 transition-all duration-300 ${
              isValidEmail
                ? "bg-primary hover:bg-primary/90 hover:scale-105 shadow-md hover:shadow-lg hover:shadow-primary/25"
                : "bg-muted text-muted-foreground opacity-30 cursor-not-allowed"
            }`}
          >
            <ArrowRight
              className={`size-4 md:size-5 ${isValidEmail ? "text-primary-foreground" : ""}`}
            />
          </Button>
        </div>
        {errors?.email?.message && (
          <div className="flex items-center gap-1.5 pl-1 animate-in slide-in-from-top-1 fade-in duration-200">
            <AlertCircle className="h-3.5 w-3.5 text-destructive shrink-0" />
            <p className="text-destructive text-sm font-medium">
              {errors.email.message}
            </p>
          </div>
        )}
      </div>
    </form>
  );
}
