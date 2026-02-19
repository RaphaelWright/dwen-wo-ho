"use client";
import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "../ui/label";
import { BaseSignInFormProps } from "@/lib/types/components/auth";
import { useTheme } from "next-themes";

export const BaseSignInForm = ({
  role,
  email,
  register,
  errors,
  onSubmit,
  onBack,
  onRecoverAccount,
  isLoading,
  isRecovering,
  errorMessage,
  forgotPasswordHref,
}: BaseSignInFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const { theme } = useTheme();
 const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  return (
    <div className="h-full flex flex-col justify-between min-h-screen py-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-center px-8 justify-between w-full">
        <Logo variant={mounted && theme === "light" ? "black" : "white"} />
        <p className="font-bold text-2xl text-muted-foreground">
          <span className="text-sm font-normal">for </span>
          {role === "patient" ? "Patients" : "Providers"}
        </p>
      </div>

      <form
        id="login-form"
        onSubmit={onSubmit}
        className="px-8 md:px-12 w-full max-w-md mx-auto space-y-8"
      >
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Welcome back
          </h1>
          <p className="text-muted-foreground">
            Sign in to access your dashboard
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            {role === "patient" && (
              <Label className="text-base font-medium pl-1">Email</Label>
            )}
            <Input
              {...register("email")}
              value={email}
              disabled
              className="h-12 bg-muted/50 border-input/20 text-lg font-medium text-muted-foreground cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base font-medium pl-1">Password</Label>
            <div className="relative">
              <Input
                {...register("password")}
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                className={`h-12 pl-4 pr-16 text-lg transition-all duration-200 ${
                  errors?.password
                    ? "border-destructive focus-visible:ring-destructive/30"
                    : "border-input focus-visible:ring-primary/30"
                }`}
                autoFocus
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <span className="text-xs font-semibold">HIDE</span>
                ) : (
                  <span className="text-xs font-semibold">SHOW</span>
                )}
              </Button>
            </div>
            {errors?.password && (
              <p className="text-sm text-destructive font-medium pl-1">
                {errors.password.message as string}
              </p>
            )}
          </div>
        </div>

        {errorMessage && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-destructive shrink-0" />
            <p className="text-destructive text-sm font-medium">
              {errorMessage}
            </p>
          </div>
        )}

        <div className="pt-2">
          <Button
            form="login-form"
            type="submit"
            disabled={isLoading || Object.keys(errors).length > 0}
            className="w-full h-12 text-lg font-bold rounded-lg shadow-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </div>

        <div className="text-center pt-4">
          <Button
            type="button"
            variant="link"
            onClick={role === "patient" ? undefined : onRecoverAccount}
            disabled={isRecovering}
            className="text-muted-foreground hover:text-primary transition-colors p-0 h-auto font-normal"
            asChild={role === "patient" && !!forgotPasswordHref}
          >
            {role === "patient" && forgotPasswordHref ? (
              <Link href={forgotPasswordHref}>Forgot your password?</Link>
            ) : (
              <span>
                {isRecovering
                  ? "Sending recovery email..."
                  : "Forgot your password?"}
              </span>
            )}
          </Button>
        </div>
      </form>

      <div className="flex border-t border-border px-8 pt-6 items-center justify-center">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground flex items-center gap-2 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform duration-300">
            ←
          </span>{" "}
          Back to email
        </Button>
      </div>
    </div>
  );
};
