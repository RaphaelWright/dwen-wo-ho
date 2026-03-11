"use client";

import { Button } from "@/components/ui/button";
import PendingVerificationModal from "@/components/modals/pending-verification";
import PhotoStep from "./steps/photo-step";
import BioStep from "./steps/bio-step";
import SpecialtyStep from "./steps/specialty-step";
import { Loader2 } from "lucide-react";
import { SignUpProfileProps } from "@/lib/types/provider/auth";
import { SIGN_UP_TEXTS } from "@/lib/constants/components/provider/auth/signup";
import { useSignUpProfile } from "@/hooks/components/provider/auth/signup/sign-up-profile";

const SignUpProfile = (props: SignUpProfileProps) => {
  const {
    currentStep,
    showPendingModal,
    setShowPendingModal,
    isSubmitting,
    profileData,
    userInfo,
    getProfileQuery,
    handleChange,
    handleBack,
    handleNext,
  } = useSignUpProfile(props);

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Photo
        return (
          <PhotoStep
            profilePhoto={profileData.photo}
            onChange={(field, value) => handleChange(field, value)}
            onNext={handleNext}
            onBack={handleBack}
          />
        );

      case 1: // Bio
        return (
          <BioStep
            phoneNumber={profileData.phoneNumber}
            bio={profileData.bio}
            onChange={(field, value) => handleChange(field, value)}
          />
        );

      case 2: // Specialty
        return (
          <SpecialtyStep
            specialty={profileData.specialty}
            onChange={(field, value) => handleChange(field, value)}
          />
        );

      default:
        return null;
    }
  };

  const steps = [
    { label: SIGN_UP_TEXTS.profile.steps.photo, index: 0 },
    { label: SIGN_UP_TEXTS.profile.steps.bio, index: 1 },
    { label: SIGN_UP_TEXTS.profile.steps.specialty, index: 2 },
  ];

  return (
    <>
      <div className="h-full flex flex-col justify-between min-h-[80vh] animate-in fade-in zoom-in-95 duration-500">
        <div className="flex-1 flex flex-col justify-center w-full max-w-4xl mx-auto px-4 md:px-8">
          {renderStepContent()}
        </div>

        {currentStep !== 0 && (
          <div className="border-t border-border bg-background/95 backdrop-blur-sm px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 sticky bottom-0 z-10">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="text-muted-foreground hover:text-foreground flex items-center gap-2 group order-2 sm:order-1"
            >
              <span className="group-hover:-translate-x-1 transition-transform">
                ←
              </span>{" "}
              {SIGN_UP_TEXTS.navigation.back}
            </Button>

            <div className="flex items-center gap-2 sm:gap-4 order-1 sm:order-2">
              {steps.map((step, i) => (
                <div key={step.index} className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                        currentStep >= step.index
                          ? "bg-primary"
                          : "bg-muted-foreground/30"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium transition-colors duration-300 ${
                        currentStep >= step.index
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-8 h-px bg-border mx-2 sm:mx-4" />
                  )}
                </div>
              ))}
            </div>

            <Button
              onClick={handleNext}
              disabled={
                isSubmitting || (currentStep === 2 && !profileData.specialty)
              }
              className="rounded-full px-8 order-3 shadow-lg hover:shadow-xl transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {SIGN_UP_TEXTS.profile.submitting}
                </>
              ) : currentStep === 2 ? (
                SIGN_UP_TEXTS.profile.submit
              ) : (
                <span className="flex items-center gap-2">
                  {SIGN_UP_TEXTS.navigation.next}{" "}
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </span>
              )}
            </Button>
          </div>
        )}
      </div>

      <PendingVerificationModal
        isOpen={showPendingModal}
        isLoading={getProfileQuery.isLoading}
        onClose={() => setShowPendingModal(false)}
        userInfo={userInfo}
      />
    </>
  );
};

export default SignUpProfile;
