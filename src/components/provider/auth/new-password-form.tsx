"use client";

import {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";
import * as z from "zod/v4";
import LoadingOverlay from "@/components/ui/loading-overlay";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import PasswordStrengthIndicator from "@/components/shared/password-strength-indicator";
import PasswordMatchIndicator from "@/components/shared/password-match-indicator";
import { NEW_PASSWORD_TEXTS } from "@/lib/constants/components/provider/auth/new-password";
import { SIGN_UP_TEXTS } from "@/lib/constants/components/provider/auth/signup";
import { ProviderPasswordSchema } from "@/lib/schemas/provider-auth-schema";
import { cn } from "@/lib/utils";

type PasswordFormData = z.infer<typeof ProviderPasswordSchema>;

export interface NewPasswordFormProps {
  email: string | null;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  password: string;
  confirmPassword: string;
  register: UseFormRegister<PasswordFormData>;
  handleSubmit: UseFormHandleSubmit<PasswordFormData>;
  errors: FieldErrors<PasswordFormData>;
  onSubmit: (values: PasswordFormData) => Promise<void>;
  isSubmitting: boolean;
}

const NewPasswordForm = ({
  email,
  showPassword,
  setShowPassword,
  password,
  confirmPassword,
  register,
  handleSubmit,
  errors,
  onSubmit,
  isSubmitting,
}: NewPasswordFormProps) => {
  const passwordsMatch =
    Boolean(password) &&
    Boolean(confirmPassword) &&
    password === confirmPassword;
  const passwordsMismatch =
    Boolean(confirmPassword) && password !== confirmPassword;

  return (
    <>
      <LoadingOverlay
        text={NEW_PASSWORD_TEXTS.toasts.loading}
        isVisible={isSubmitting}
      />
      <form
        id="new-password-form"
        onSubmit={handleSubmit(onSubmit)}
        className="animate-in fade-in slide-in-from-bottom-8 mx-auto w-full max-w-lg space-y-8 px-8 duration-700"
      >
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-balance">
            {NEW_PASSWORD_TEXTS.form.title}
          </h1>
          <p className="text-muted-foreground">
            {NEW_PASSWORD_TEXTS.form.subtitle}
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>
              {NEW_PASSWORD_TEXTS.form.emailLabel}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              value={email ? decodeURIComponent(email) : ""}
              disabled
              className="bg-muted text-muted-foreground h-12 cursor-not-allowed text-lg font-medium"
            />
          </div>

          <div className="space-y-2">
            <Label>
              {NEW_PASSWORD_TEXTS.form.passwordLabel}
              <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder={SIGN_UP_TEXTS.createAccount.passwordPlaceholder}
                className={cn(
                  "h-12 pr-16 pl-4 text-lg transition-all duration-200",
                  errors?.password &&
                    "border-destructive focus-visible:ring-destructive/30",
                )}
                autoComplete="new-password"
              />
              <Button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                variant="ghost"
                size="sm"
              >
                {showPassword ? (
                  <span className="text-xs font-semibold">HIDE</span>
                ) : (
                  <span className="text-xs font-semibold">SHOW</span>
                )}
              </Button>
            </div>
            {password && <PasswordStrengthIndicator password={password} />}
            {errors?.password && (
              <p className="text-destructive pl-1 text-sm font-medium">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>
              {NEW_PASSWORD_TEXTS.form.confirmPasswordLabel}
              <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                {...register("confirmPassword")}
                type={showPassword ? "text" : "password"}
                placeholder={NEW_PASSWORD_TEXTS.form.repeatPasswordPlaceholder}
                className={cn(
                  "h-12 pr-16 pl-4 text-lg transition-all duration-200",
                  passwordsMatch &&
                    "border-success focus-visible:ring-success/30",
                  passwordsMismatch &&
                    "border-destructive focus-visible:ring-destructive/30",
                  !passwordsMatch &&
                    !passwordsMismatch &&
                    !errors?.confirmPassword &&
                    "border-input focus-visible:ring-primary/30",
                  errors?.confirmPassword &&
                    "border-destructive focus-visible:ring-destructive/30",
                )}
                autoComplete="new-password"
              />
              <Button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                variant="ghost"
                size="sm"
              >
                {showPassword ? (
                  <span className="text-xs font-semibold">HIDE</span>
                ) : (
                  <span className="text-xs font-semibold">SHOW</span>
                )}
              </Button>
            </div>
            <PasswordMatchIndicator
              password={password}
              confirmPassword={confirmPassword}
              matchLabel={NEW_PASSWORD_TEXTS.passwordMatch.match}
              mismatchLabel={NEW_PASSWORD_TEXTS.passwordMatch.mismatch}
            />
            {errors?.confirmPassword && (
              <p className="text-destructive pl-1 text-sm font-medium">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>
      </form>
    </>
  );
};

export default NewPasswordForm;
