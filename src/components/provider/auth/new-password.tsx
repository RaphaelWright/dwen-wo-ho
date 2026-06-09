"use client";

import { Suspense, useEffect, useState } from "react";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import Stepper from "@/components/miscellaneous/stepper";
import { recoverSteps } from "@/lib/utils";
import { SIGN_UP_TEXTS } from "@/lib/constants/components/provider/auth/signup";
import { NEW_PASSWORD_TEXTS } from "@/lib/constants/components/provider/auth/new-password";
import { useTheme } from "next-themes";
import { Loader2 } from "lucide-react";
import NewPasswordForm from "./new-password-form";
import { useNewPassword } from "@/hooks/components/provider/auth/use-new-password";

const NewPasswordContent = () => {
  const {
    email,
    showPassword,
    setShowPassword,
    password,
    confirmPassword,
    isFormValid,
    register,
    handleSubmit,
    errors,
    onSubmit,
    handleBack,
    resetPasswordMutation,
  } = useNewPassword();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <div className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/50 transition-all duration-300">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto px-6 py-4">
          <Logo variant={mounted && theme === "light" ? "black" : "white"} />
          <p className="text-xl font-semibold hidden sm:block">
            <span className="text-sm font-normal text-muted-foreground mr-2">
              {SIGN_UP_TEXTS.header.for}
            </span>
            {SIGN_UP_TEXTS.header.providers}
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <NewPasswordForm
          email={email}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          password={password}
          confirmPassword={confirmPassword}
          register={register}
          handleSubmit={handleSubmit}
          errors={errors}
          onSubmit={onSubmit}
          isSubmitting={resetPasswordMutation.isPending}
        />
      </div>

      <div className="sticky bottom-0 z-50 bg-background/80 backdrop-blur-md border-t border-border flex flex-col sm:flex-row px-6 py-4 items-center justify-between gap-4 mt-auto transition-all duration-300">
        <div className="flex w-full max-w-7xl mx-auto items-center justify-between gap-4 flex-col sm:flex-row">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="rounded-full px-6 py-2 text-muted-foreground hover:text-foreground flex items-center gap-2 group order-2 sm:order-1"
          >
            <span className="group-hover:-translate-x-1 transition-transform">
              ←
            </span>{" "}
            {NEW_PASSWORD_TEXTS.form.back}
          </Button>

          <div className="flex-1 flex justify-center order-1 sm:order-2 w-full sm:w-auto">
            <Stepper steps={recoverSteps} step="New Password" />
          </div>

          <div className="order-3 w-full sm:w-auto flex justify-end">
            <Button
              form="new-password-form"
              type="submit"
              disabled={!isFormValid || resetPasswordMutation.isPending}
              className="rounded-full px-8 shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
            >
              {NEW_PASSWORD_TEXTS.form.savePassword}{" "}
              <span className="ml-2">→</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const NewPassword = () => {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-full flex items-center justify-center bg-background">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <NewPasswordContent />
    </Suspense>
  );
};

export default NewPassword;
