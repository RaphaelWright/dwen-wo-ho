"use client";

import { Button } from "@/components/ui/button";
import PendingVerificationModal from "@/components/modals/pending-verification";
import PhotoStep from "./steps/photo-step";
import BioStep from "./steps/bio-step";
import SpecialtyStep from "./steps/specialty-step";
import { Loader2 } from "lucide-react";
import { SignUpProfileProps } from "@/lib/types/provider/auth";
import { SIGN_UP_TEXTS } from "@/lib/constants/components/provider/auth/signup";
import { useSignUpProfile } from "@/hooks/components/provider/auth/signup/use-sign-up-profile";

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

  return (
    <>
      {/* Photo step has its own complete layout, render with flex wrapper to push nav to bottom */}
      {currentStep === 0 ? (
        <div className="h-full flex flex-col">
          <div className="flex-1 flex flex-col justify-center">
            {renderStepContent()}
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col pb-10">
          {/* Main Content */}
          <div className="flex-1  flex flex-col justify-center">
            <div className="w-full max-w-4xl mx-auto">
              {renderStepContent()}
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="flex flex-col sm:flex-row border-t border-gray-500 px-4 sm:px-6 lg:px-6 py-4 items-center justify-between space-y-4 sm:space-y-0 mt-8 fixed bottom-0 right-0 w-full lg:w-1/2 bg-white">
            <Button
              onClick={handleBack}
              className="rounded-full mr-2 px-8 py-1 border-4 bg-white text-[#955aa4] text-lg font-bold border-[#955aa4] uppercase flex items-center justify-center hover:bg-white"
            >
              {SIGN_UP_TEXTS.navigation.back}
            </Button>

            <div className="flex-1 flex justify-center">
              <div className="flex items-center gap-4 text-sm">
                {/* Photo Step */}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      currentStep >= 0 ? "bg-black" : "border-2 border-gray-400"
                    }`}
                  />
                  <span
                    className={`${
                      currentStep >= 0
                        ? "font-semibold text-black"
                        : "text-gray-400"
                    }`}
                  >
                    {SIGN_UP_TEXTS.profile.steps.photo}
                  </span>
                </div>
                <span className="text-gray-400">—</span>

                {/* Bio Step */}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      currentStep >= 1 ? "bg-black" : "border-2 border-gray-400"
                    }`}
                  />
                  <span
                    className={`${
                      currentStep >= 1
                        ? "font-semibold text-black"
                        : "text-gray-400"
                    }`}
                  >
                    {SIGN_UP_TEXTS.profile.steps.bio}
                  </span>
                </div>
                <span className="text-gray-400">—</span>

                {/* Specialty Step */}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      currentStep >= 2 ? "bg-black" : "border-2 border-gray-400"
                    }`}
                  />
                  <span
                    className={`${
                      currentStep >= 2
                        ? "font-semibold text-black"
                        : "text-gray-400"
                    }`}
                  >
                    {SIGN_UP_TEXTS.profile.steps.specialty}
                  </span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleNext}
              disabled={
                isSubmitting || (currentStep === 2 && !profileData.specialty)
              }
              className="rounded-full ml-2 px-8 py-1 border-4 text-lg font-bold uppercase transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed bg-[#955aa4]/80 text-white border-[#955aa4] hover:bg-[#955aa4] disabled:hover:bg-[#955aa4]/80"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {SIGN_UP_TEXTS.profile.submitting}
                </>
              ) : currentStep === 2 ? (
                SIGN_UP_TEXTS.profile.submit
              ) : (
                SIGN_UP_TEXTS.navigation.next
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Pending Verification Modal */}
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
