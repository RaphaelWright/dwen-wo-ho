import Link from "next/link";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { SignInFormProps } from "@/lib/types/components/patient/signin";
import { SIGN_IN_TEXTS } from "@/lib/constants/components/patient/signin";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SignInForm({
  email,
  register,
  errors,
  showPassword,
  onTogglePassword,
  onSubmit,
  forgotPasswordHref,
}: SignInFormProps) {
  return (
    <form
      id="login-form"
      onSubmit={onSubmit}
      className="mx-auto w-full max-w-2xl px-8 md:px-20"
    >
      {/* Title Section */}
      <div className="mb-10 text-center">
        <h1 className="from-primary to-primary/70 bg-linear-to-r bg-clip-text text-3xl font-bold tracking-tight text-transparent md:text-4xl">
          {SIGN_IN_TEXTS.form.title}
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Enter your password to continue
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-5">
        {/* Email Field */}
        <div className="space-y-2">
          <Label className="text-muted-foreground pl-1 text-sm font-medium">
            {SIGN_IN_TEXTS.form.emailLabel}
          </Label>
          <Input
            {...register("email")}
            value={email}
            disabled
            className="border-border bg-muted/50 text-muted-foreground h-12 w-full rounded-xl border px-4 py-3 text-sm transition-all duration-200 md:text-base"
          />
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label className="text-muted-foreground pl-1 text-sm font-medium">
            {SIGN_IN_TEXTS.form.passwordLabel}
          </Label>
          <div className="group relative">
            <Input
              {...register("password")}
              placeholder={SIGN_IN_TEXTS.form.passwordPlaceholder}
              type={showPassword ? "text" : "password"}
              className={`bg-muted/30 focus:ring-primary/20 focus:border-primary h-12 w-full rounded-xl border px-4 py-3 pr-12 text-sm transition-all duration-200 focus:ring-2 md:text-base ${
                errors?.password
                  ? "border-destructive text-destructive focus:ring-destructive/20 focus:border-destructive"
                  : "border-border text-foreground"
              }`}
              autoFocus
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onTogglePassword}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 h-8 w-8 -translate-y-1/2 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Forgot Password Link */}
      <div className="mt-6 text-center">
        <p className="text-muted-foreground flex items-center justify-center gap-4 text-sm">
          {SIGN_IN_TEXTS.form.recoverPrompt}{" "}
          {forgotPasswordHref && (
            <Link
              href={forgotPasswordHref}
              className="text-primary hover:text-primary/80 decoration-primary/30 hover:decoration-primary flex items-center justify-center gap-2 font-semibold underline underline-offset-4 transition-colors"
            >
              {SIGN_IN_TEXTS.form.recoverLink}
              <ArrowRight className="size-4" />
            </Link>
          )}
        </p>
      </div>
    </form>
  );
}
