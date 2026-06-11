"use client";

import { Suspense, type ReactNode } from "react";
import { useHydrated } from "@/hooks/use-hydrated";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import Stepper from "@/components/miscellaneous/stepper";
import { signUpSteps } from "@/lib/utils";
import CreateAccount from "./signup/create-account";
import SignUpVerification from "./signup/sign-up-verification";
import SignUpProfile from "./signup/sign-up-profile";
import { ProviderSignUpProps } from "@/lib/types/provider/auth";
import { SIGN_UP_TEXTS } from "@/lib/constants/components/provider/auth/signup";
import { useProviderSignUp } from "@/hooks/components/provider/auth/use-provider-sign-up";
import { useTheme } from "next-themes";
import { Loader2 } from "lucide-react";

const SignUpContent = (props: ProviderSignUpProps) => {
  const { specialty, profileImage } = props;
  const {
    currentStep,
    agreedToTerms,
    setAgreedToTerms,
    isFormValid,
    setIsFormValid,
    signUpData,
    handleCreateAccountNext,
    handleVerificationNext,
    handleBack,
    getCurrentStepLabel,
    isResumeLocked,
    isCheckingGuard,
    profileStep,
  } = useProviderSignUp(props);
  const { theme } = useTheme();
  const mounted = useHydrated();

  let stepContent: ReactNode = null;
  switch (currentStep) {
    case "create":
      stepContent = (
        <CreateAccount
          email={signUpData.email}
          fullName={signUpData.fullName}
          title={signUpData.title}
          agreedToTerms={agreedToTerms}
          onAgreedToTermsChange={setAgreedToTerms}
          onNext={handleCreateAccountNext}
          onValidityChange={setIsFormValid}
        />
      );
      break;

    case "verify":
      stepContent = (
        <SignUpVerification
          email={signUpData.email}
          onNext={handleVerificationNext}
        />
      );
      break;

    case "profile":
      stepContent = (
        <SignUpProfile
          email={signUpData.email}
          fullName={signUpData.fullName}
          title={signUpData.title}
          password={signUpData.password}
          specialty={specialty}
          profileImage={profileImage}
          onBack={isResumeLocked ? undefined : () => handleBack()}
          startStep={profileStep ?? 0}
          isResumeLocked={isResumeLocked}
        />
      );
      break;
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      {isCheckingGuard && (
        <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            <p className="text-muted-foreground font-medium animate-pulse">
              {SIGN_UP_TEXTS.resume.checking}
            </p>
          </div>
        </div>
      )}

      <div
        className={`flex flex-col min-h-screen transition-opacity duration-500 ease-in-out ${
          isCheckingGuard ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
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
          {stepContent}
        </div>

        {currentStep !== "profile" && (
          <div className="sticky bottom-0 z-50 bg-background/80 backdrop-blur-md border-t border-border flex flex-col sm:flex-row px-6 py-4 items-center justify-between gap-4 mt-auto transition-all duration-300">
            <div className="flex w-full max-w-7xl mx-auto items-center justify-between gap-4 flex-col sm:flex-row">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={isResumeLocked && currentStep !== "create"}
                className="rounded-full px-6 py-2 text-muted-foreground hover:text-foreground flex items-center gap-2 group order-2 sm:order-1"
              >
                <span className="group-hover:-translate-x-1 transition-transform">
                  ←
                </span>{" "}
                {SIGN_UP_TEXTS.navigation.back}
              </Button>

              <div className="flex-1 flex justify-center order-1 sm:order-2 w-full sm:w-auto">
                <Stepper steps={signUpSteps} step={getCurrentStepLabel()} />
              </div>

              <div className="order-3 w-full sm:w-auto flex justify-end">
                {currentStep === "create" ? (
                  <Button
                    form="create-account-form"
                    type="submit"
                    disabled={!agreedToTerms || !isFormValid}
                    className="rounded-full px-8 shadow-lg hover:shadow-xl transition-all"
                  >
                    {SIGN_UP_TEXTS.navigation.next}{" "}
                    <span className="ml-2">→</span>
                  </Button>
                ) : (
                  <div className="w-25 hidden sm:block"></div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ProviderSignUp = (props: ProviderSignUpProps) => {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-full flex items-center justify-center bg-background">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <SignUpContent {...props} />
    </Suspense>
  );
};

export default ProviderSignUp;
