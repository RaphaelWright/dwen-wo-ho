"use client";
import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LoadingButton } from "@/components/ui/loading-button";
import { Input } from "@/components/ui/input";
import { Label } from "../ui/label";
import { BaseSignInFormProps } from "@/lib/types/components/auth";
import { useTheme } from "next-themes";
import { useHydrated } from "@/hooks/use-hydrated";

export const BaseSignInForm = ({
  audience,
  email,
  register,
  errors,
  onSubmit,
  onBack,
  onRecoverAccount,
  isLoading,
  isRecovering,
  successMessage,
  forgotPasswordHref,
}: BaseSignInFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const { theme } = useTheme();
  const mounted = useHydrated();

  return (
    <div className="h-full flex flex-col justify-between gap-10 min-h-screen py-4 sm:py-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-center px-4 sm:px-8 justify-between w-full">
        <Logo
          variant={mounted && theme === "light" ? "black" : "white"}
          className="w-[140px] sm:w-auto h-auto"
        />
        <p className="font-bold text-lg sm:text-2xl text-muted-foreground">
          <span className="text-sm font-normal">for </span>
          {audience === "patient" ? "Patients" : "Providers"}
        </p>
      </div>

      <form
        id="login-form"
        onSubmit={onSubmit}
        className="px-4 sm:px-8 md:px-12 w-full max-w-md mx-auto space-y-8"
      >
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Welcome back
          </h1>
          <p className="text-muted-foreground">
            Sign in to access your dashboard
          </p>
        </div>

        {successMessage && (
          <p className="text-success text-sm font-medium text-center">
            {successMessage}
          </p>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-base font-medium pl-1">Email</Label>
            <Input
              {...register("email")}
              defaultValue={email}
              readOnly
              tabIndex={-1}
              placeholder={
                email ? undefined : "Enter your email on the previous step"
              }
              className="h-12 bg-muted font-medium text-foreground cursor-not-allowed opacity-100 disabled:opacity-100 border-input"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base font-medium pl-1">Password</Label>
            <div className="relative">
              <Input
                {...register("password")}
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                className={`h-12 pl-4 pr-16 transition-all duration-200 ${
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

        <div className="pt-2">
          <LoadingButton
            form="login-form"
            type="submit"
            loading={isLoading}
            loadingText="Signing In..."
            disabled={!email || Object.keys(errors).length > 0}
            className="w-full h-12 text-lg font-bold rounded-lg shadow-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            Sign In
          </LoadingButton>
        </div>

        <div className="text-center pt-4">
          {audience === "patient" && forgotPasswordHref ? (
            <Button
              type="button"
              variant="link"
              className="text-muted-foreground hover:text-primary transition-colors p-0 h-auto font-normal"
              asChild
            >
              <Link href={forgotPasswordHref}>Forgot your password?</Link>
            </Button>
          ) : (
            <LoadingButton
              type="button"
              variant="link"
              onClick={onRecoverAccount}
              loading={isRecovering}
              loadingText="Sending recovery email..."
              className="text-muted-foreground hover:text-primary transition-colors p-0 h-auto font-normal"
            >
              Forgot your password?
            </LoadingButton>
          )}
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
