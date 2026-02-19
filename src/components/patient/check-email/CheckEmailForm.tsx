import { Button } from "@/components/ui/button";
import Image from "next/image";
import { CheckEmailFormProps } from "@/lib/types/components/patient/check-email";
import { CHECK_EMAIL_TEXTS } from "@/lib/constants/components/patient/check-email";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";

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
      className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300"
    >
      <div className="flex flex-col gap-4">
        <Label className="text-lg sm:text-xl md:text-2xl font-bold text-foreground/80 pl-2">
          {CHECK_EMAIL_TEXTS.form.emailLabel}
        </Label>
        <div className="group relative flex items-center gap-1 rounded-2xl dark:bg-input backdrop-blur-md border border-border/20 shadow-xl transition-all duration-500 focus-within:border-primary/50 focus-within:shadow-[0_0_30px_rgba(var(--primary),0.15)]">
          <Input
            {...register("email")}
            onChange={(e) => {
              register("email").onChange(e);
              onEmailChange(e);
            }}
            placeholder={CHECK_EMAIL_TEXTS.form.emailPlaceholder}
            className={`font-medium w-full border-none shadow-none text-lg md:text-xl p-4 md:p-5 text-foreground placeholder:text-muted-foreground/50 h-auto rounded-2xl`}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!isValidEmail}
            className={`mr-1 rounded-full size-10 md:h-12 md:w-12 transition-all duration-500 ${
              isValidEmail
                ? "bg-linear-to-tr from-primary to-purple-600 hover:scale-105 shadow-[0_0_20px_rgba(var(--primary),0.4)] hover:shadow-[0_0_30px_rgba(var(--primary),0.6)]"
                : "bg-muted text-muted-foreground opacity-30 cursor-not-allowed"
            }`}
          >
            <ArrowRight
              className={`size-5 md:w-6 md:h-6 ${isValidEmail ? "brightness-0 invert" : ""}`}
            />
          </Button>
        </div>
        {errors?.email?.message && (
          <p className="text-destructive font-medium pl-2 animate-in slide-in-from-top-1 fade-in">
            {errors.email.message}
          </p>
        )}
      </div>
    </form>
  );
}
