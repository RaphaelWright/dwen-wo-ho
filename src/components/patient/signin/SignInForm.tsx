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
      className="px-8 md:px-20 w-full max-w-2xl mx-auto"
    >
      {/* Title Section */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          {SIGN_IN_TEXTS.form.title}
        </h1>
        <p className="mt-2 text-muted-foreground text-sm">
          Enter your password to continue
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-5">
        {/* Email Field */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-muted-foreground pl-1">
            {SIGN_IN_TEXTS.form.emailLabel}
          </Label>
          <Input
            {...register("email")}
            value={email}
            disabled
            className="w-full rounded-xl border border-border bg-muted/50 text-sm md:text-base text-muted-foreground px-4 py-3 h-12 transition-all duration-200"
          />
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-muted-foreground pl-1">
            {SIGN_IN_TEXTS.form.passwordLabel}
          </Label>
          <div className="relative group">
            <Input
              {...register("password")}
              placeholder={SIGN_IN_TEXTS.form.passwordPlaceholder}
              type={showPassword ? "text" : "password"}
              className={`w-full rounded-xl border bg-muted/30 text-sm md:text-base px-4 py-3 h-12 pr-12 transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary ${
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
              className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors h-8 w-8"
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
      <div className="text-center mt-6">
        <p className="text-sm text-muted-foreground flex items-center justify-center gap-4">
          {SIGN_IN_TEXTS.form.recoverPrompt}{" "}
          {forgotPasswordHref && (
            <Link
              href={forgotPasswordHref}
              className="text-primary flex items-center justify-center gap-2 font-semibold hover:text-primary/80 transition-colors underline underline-offset-4 decoration-primary/30 hover:decoration-primary"
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
