"use client";

import {
  OnboardingAuthFooter,
  OnboardingPhaseFooter,
} from "@/components/patient/onboarding/workspace/footers";
import { OnboardingWorkspaceHeader } from "@/components/patient/onboarding/workspace/header";
import { OnboardingStepContent } from "@/components/patient/onboarding/workspace/step-content";
import { OnboardingShellContent } from "@/components/patient/onboarding/shell";
import { useOnboardingWorkspace } from "@/hooks/components/patient/onboarding/workspace/use-onboarding-workspace";
import type { SchoolType } from "@/lib/types/components/patient/onboarding";

export function OnboardingWorkspace() {
  const workspace = useOnboardingWorkspace();
  const {
    screen,
    contactMode,
    otp,
    draft,
    referralHandle,
    fieldValidation,
    signInPassword,
    authStepLabel,
    onboardingStepLabel,
    completedOnboardingSteps,
    canAdvance,
    showAuthFooter,
    showAuthStepper,
    showOnboardingFooter,
    backDisabled,
    nextLabel,
    setContactMode,
    setOtp,
    setSignInPassword,
    updateDraft,
    goBack,
    handleNext,
    handleContactSubmit,
    handleForgotPassword,
    handleFieldBlur,
    handlePhotoChange,
    handleSchoolSelect,
    handleProgrammeChange,
  } = workspace;

  return (
    <OnboardingShellContent>
      <OnboardingWorkspaceHeader referralHandle={referralHandle} />

      <div className="mt-5 min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain sm:mt-0">
        <div className="flex min-h-full items-start justify-center px-4 py-5 sm:items-center sm:px-6 sm:py-8 lg:py-10">
          <div className="mx-auto w-full max-w-md">
            <OnboardingStepContent
              screen={screen}
              contactMode={contactMode}
              draft={draft}
              otp={otp}
              signInPassword={signInPassword}
              fieldValidation={fieldValidation}
              onContactModeChange={setContactMode}
              onDraftChange={updateDraft}
              onFieldBlur={handleFieldBlur}
              onOtpChange={setOtp}
              onSignInPasswordChange={setSignInPassword}
              onContactSubmit={handleContactSubmit}
              onForgotPassword={handleForgotPassword}
              onPhotoChange={handlePhotoChange}
              onProgrammeChange={handleProgrammeChange}
              onSchoolTypeChange={(schoolType: SchoolType) =>
                updateDraft({ schoolType, schoolId: "", schoolName: "" })
              }
              onSelectSchool={handleSchoolSelect}
              onGradeChange={(gradeShort) => updateDraft({ gradeShort })}
            />
          </div>
        </div>
      </div>

      {showAuthFooter ? (
        <OnboardingAuthFooter
          stepLabel={authStepLabel}
          showStepper={showAuthStepper}
          backDisabled={backDisabled}
          nextDisabled={!canAdvance}
          nextLabel={nextLabel}
          onBack={goBack}
          onNext={handleNext}
        />
      ) : null}

      {showOnboardingFooter ? (
        <OnboardingPhaseFooter
          stepLabel={onboardingStepLabel}
          completedSteps={completedOnboardingSteps}
          backDisabled={backDisabled}
          nextDisabled={!canAdvance}
          nextLabel={nextLabel}
          onBack={goBack}
          onNext={handleNext}
        />
      ) : null}
    </OnboardingShellContent>
  );
}
