"use client";

import { Suspense } from "react";
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

const SignUpContent = (props: ProviderSignUpProps) => {
  const { specialty, profileImage, isPending, profileStep } = props;
  const {
    currentStep,
    setCurrentStep,
    agreedToTerms,
    setAgreedToTerms,
    isFormValid,
    setIsFormValid,
    signUpData,
    handleCreateAccountNext,
    handleVerificationNext,
    handleBack,
    getCurrentStepLabel,
  } = useProviderSignUp(props);

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case "create":
        return (
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

      case "verify":
        return (
          <SignUpVerification
            email={signUpData.email}
            onNext={handleVerificationNext}
          />
        );

      case "profile":
        return (
          <SignUpProfile
            email={signUpData.email}
            fullName={signUpData.fullName}
            title={signUpData.title}
            password={signUpData.password}
            specialty={specialty}
            profileImage={profileImage}
            isPending={isPending}
            onBack={() => setCurrentStep("verify")}
            startStep={profileStep || 0}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between w-full px-8 py-4">
        <Logo />
        <p className="text-2xl font-bold">
          <span className="text-sm">{SIGN_UP_TEXTS.header.for}</span>{" "}
          {SIGN_UP_TEXTS.header.providers}
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center px-6 lg:px-0 overflow-auto">
        {renderStepContent()}
      </div>

      {/* Bottom Navigation - Hidden on Profile Step */}
      {currentStep !== "profile" && (
        <div className="flex flex-col sm:flex-row border-t border-gray-500 px-4 sm:px-6 lg:px-6 py-4 items-center justify-between space-y-4 sm:space-y-0 mt-auto">
          <Button
            onClick={handleBack}
            className="rounded-full mr-2 px-8 py-1 border-4 bg-white text-[#955aa4] text-lg font-bold border-[#955aa4] uppercase flex items-center justify-center hover:bg-white"
          >
            {SIGN_UP_TEXTS.navigation.back}
          </Button>

          <div className="flex-1 flex justify-center">
            <Stepper steps={signUpSteps} step={getCurrentStepLabel()} />
          </div>

          {currentStep === "create" ? (
            <button
              form="create-account-form"
              type="submit"
              disabled={!agreedToTerms || !isFormValid}
              className="rounded-full ml-2 px-8 py-1 border-4 text-lg font-bold uppercase transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed bg-[#955aa4]/80 text-white border-[#955aa4] hover:bg-[#955aa4] disabled:hover:bg-[#955aa4]/80"
            >
              {SIGN_UP_TEXTS.navigation.next}
            </button>
          ) : (
            <Button className="invisible rounded-full px-6 py-2 border-2">
              {SIGN_UP_TEXTS.navigation.next}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

const ProviderSignUp = (props: ProviderSignUpProps) => {
  return (
    <Suspense fallback={<div>{SIGN_UP_TEXTS.loading}</div>}>
      <SignUpContent {...props} />
    </Suspense>
  );
};

export default ProviderSignUp;
