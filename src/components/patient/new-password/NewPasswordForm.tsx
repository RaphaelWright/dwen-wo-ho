import { NewPasswordFormProps } from "@/lib/types/components/patient/new-password";
import { NEW_PASSWORD_TEXTS } from "@/lib/constants/components/patient/new-password";
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
      className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8"
    >
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {NEW_PASSWORD_TEXTS.form.title}
        </h1>
        <p className="text-muted-foreground text-sm">
          Please create a secure password for your account.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground ml-1">
            New Password
          </Label>
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
            <Input
              {...register("password")}
              placeholder={NEW_PASSWORD_TEXTS.form.passwordPlaceholder}
              type={showPassword ? "text" : "password"}
              className={`pl-10 pr-10 h-11 rounded-xl bg-muted/30 border-input/60 focus-visible:ring-primary/20 focus-visible:border-primary transition-all duration-200 ${
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
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-transparent"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          {errors?.password?.message && (
            <div className="flex items-center gap-1.5 pl-1 animate-in slide-in-from-top-1 fade-in duration-200">
              <AlertCircle className="h-3.5 w-3.5 text-destructive shrink-0" />
              <p className="text-destructive text-xs font-medium">
                {errors.password.message}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground ml-1">
            Confirm Password
          </Label>
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
            <Input
              {...register("repeatPassword")}
              placeholder={NEW_PASSWORD_TEXTS.form.repeatPasswordPlaceholder}
              type={showPassword ? "text" : "password"}
              className={`pl-10 pr-10 h-11 rounded-xl bg-muted/30 border-input/60 focus-visible:ring-primary/20 focus-visible:border-primary transition-all duration-200 ${
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
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-transparent"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          {errors?.repeatPassword?.message && (
            <div className="flex items-center gap-1.5 pl-1 animate-in slide-in-from-top-1 fade-in duration-200">
              <AlertCircle className="h-3.5 w-3.5 text-destructive shrink-0" />
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
