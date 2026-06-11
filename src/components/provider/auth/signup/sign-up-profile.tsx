"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import PhotoStep from "./steps/photo-step";
import BioStep from "./steps/bio-step";
import SpecialtyStep from "./steps/specialty-step";
import { LoadingButton } from "@/components/ui/loading-button";
import { SignUpProfileProps } from "@/lib/types/provider/auth";
import { SIGN_UP_TEXTS } from "@/lib/constants/components/provider/auth/signup";
import { useSignUpProfile } from "@/hooks/components/provider/auth/signup/sign-up-profile";

const steps = [
  { label: SIGN_UP_TEXTS.profile.steps.photo, index: 0 },
  { label: SIGN_UP_TEXTS.profile.steps.bio, index: 1 },
  { label: SIGN_UP_TEXTS.profile.steps.specialty, index: 2 },
];

const SignUpProfile = (props: SignUpProfileProps) => {
  const {
    currentStep,
    isSubmitting,
    profileData,
    handleChange,
    handleBack,
    handleNext,
    isCurrentStepValid,
    hideBackAtRoot,
  } = useSignUpProfile(props);

  let stepContent: ReactNode = null;
  switch (currentStep) {
    case 0:
      stepContent = (
        <PhotoStep
          profilePhoto={profileData.photo}
          onChange={(field, value) => handleChange(field, value)}
          onNext={handleNext}
          onBack={handleBack}
        />
      );
      break;

    case 1:
      stepContent = (
        <BioStep
          phoneNumber={profileData.phoneNumber}
          bio={profileData.bio}
          onChange={(field, value) => handleChange(field, value)}
        />
      );
      break;

    case 2:
      stepContent = (
        <SpecialtyStep
          specialty={profileData.specialty}
          onChange={(field, value) => handleChange(field, value)}
        />
      );
      break;
  }

  return (
    <div className="h-full flex flex-col justify-between min-h-[80vh] animate-in fade-in zoom-in-95 duration-500">
      <div className="flex-1 flex flex-col justify-center w-full max-w-4xl mx-auto px-0 sm:px-4 md:px-8">
        {stepContent}
      </div>

      <div className="border-t border-border bg-background/95 backdrop-blur-sm px-3 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mt-8 sticky bottom-0 z-10">
        {hideBackAtRoot ? (
          <div className="order-2 sm:order-1 w-full sm:w-auto" aria-hidden />
        ) : (
          <Button
            variant="ghost"
            onClick={handleBack}
            className="text-muted-foreground hover:text-foreground flex items-center gap-2 group order-2 sm:order-1 w-full sm:w-auto justify-center sm:justify-start"
          >
            <span className="group-hover:-translate-x-1 transition-transform">
              ←
            </span>{" "}
            {SIGN_UP_TEXTS.navigation.back}
          </Button>
        )}

        <div className="flex items-center gap-1 sm:gap-4 order-1 sm:order-2 max-w-full overflow-x-auto">
          {steps.map((step, i) => (
            <div key={step.index} className="flex items-center shrink-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-colors duration-300 ${
                    currentStep >= step.index
                      ? "bg-primary"
                      : "bg-muted-foreground/30"
                  }`}
                />
                <span
                  className={`text-xs sm:text-sm font-medium transition-colors duration-300 whitespace-nowrap ${
                    currentStep >= step.index
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="w-3 sm:w-8 h-px bg-border mx-1.5 sm:mx-4" />
              )}
            </div>
          ))}
        </div>

        <LoadingButton
          onClick={handleNext}
          loading={isSubmitting}
          loadingText={SIGN_UP_TEXTS.profile.submitting}
          disabled={!isCurrentStepValid}
          className="rounded-full px-6 sm:px-8 order-3 shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
        >
          {currentStep === 2 ? (
            SIGN_UP_TEXTS.profile.submit
          ) : (
            <span className="flex items-center gap-2">
              {SIGN_UP_TEXTS.navigation.next}{" "}
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </span>
          )}
        </LoadingButton>
      </div>
    </div>
  );
};

export default SignUpProfile;
