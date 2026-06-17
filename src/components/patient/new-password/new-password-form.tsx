import { NewPasswordFormProps } from "@/lib/types/components/patient/new-password";
import { NEW_PASSWORD_TEXTS } from "@/lib/constants/components/patient/auth-copy";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Lock, AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";

export function NewPasswordForm({
  register,
  errors,
  showPassword,
  onTogglePassword,
  onSubmit,
}: NewPasswordFormProps) {
  return (
    <form
      id="login-form"
      onSubmit={onSubmit}
      className="animate-in fade-in slide-in-from-bottom-4 mx-auto w-full max-w-md space-y-8 duration-700"
    >
      <div className="space-y-2 text-center">
        <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
          {NEW_PASSWORD_TEXTS.form.title}
        </h1>
        <p className="text-muted-foreground text-sm">
          Please create a secure password for your account.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-muted-foreground ml-1 text-xs font-medium">
            New Password
          </Label>
          <div className="group relative">
            <Lock className="text-muted-foreground group-focus-within:text-primary absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transition-colors duration-200" />
            <Input
              {...register("password")}
              placeholder={NEW_PASSWORD_TEXTS.form.passwordPlaceholder}
              type={showPassword ? "text" : "password"}
              className={`bg-muted/30 border-input/60 focus-visible:ring-primary/20 focus-visible:border-primary h-11 rounded-xl pr-10 pl-10 transition-all duration-200 ${
                errors?.password?.message
                  ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
                  : ""
              }`}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onTogglePassword}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2 hover:bg-transparent"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          {errors?.password?.message && (
            <div className="animate-in slide-in-from-top-1 fade-in flex items-center gap-1.5 pl-1 duration-200">
              <AlertCircle className="text-destructive h-3.5 w-3.5 shrink-0" />
              <p className="text-destructive text-xs font-medium">
                {errors.password.message}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-muted-foreground ml-1 text-xs font-medium">
            Confirm Password
          </Label>
          <div className="group relative">
            <Lock className="text-muted-foreground group-focus-within:text-primary absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transition-colors duration-200" />
            <Input
              {...register("repeatPassword")}
              placeholder={NEW_PASSWORD_TEXTS.form.repeatPasswordPlaceholder}
              type={showPassword ? "text" : "password"}
              className={`bg-muted/30 border-input/60 focus-visible:ring-primary/20 focus-visible:border-primary h-11 rounded-xl pr-10 pl-10 transition-all duration-200 ${
                errors?.repeatPassword?.message
                  ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
                  : ""
              }`}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onTogglePassword}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2 hover:bg-transparent"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          {errors?.repeatPassword?.message && (
            <div className="animate-in slide-in-from-top-1 fade-in flex items-center gap-1.5 pl-1 duration-200">
              <AlertCircle className="text-destructive h-3.5 w-3.5 shrink-0" />
              <p className="text-destructive text-xs font-medium">
                {errors.repeatPassword.message}
              </p>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
