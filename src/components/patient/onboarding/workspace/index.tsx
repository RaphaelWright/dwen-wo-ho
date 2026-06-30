"use client";

import {
  OnboardingAuthFooter,
  OnboardingPhaseFooter,
} from "@/components/patient/onboarding/workspace/footers";
import { OnboardingWorkspaceHeader } from "@/components/patient/onboarding/workspace/header";
import { OnboardingStepContent } from "@/components/patient/onboarding/workspace/step-content";
import { OnboardingShellContent } from "@/components/patient/onboarding/shell";
import { useOnboardingWorkspace } from "@/hooks/components/patient/onboarding/workspace/use-onboarding-workspace";
import { ONBOARDING_SCREENS } from "@/lib/constants/components/patient/onboarding";
import type { SchoolType } from "@/lib/types/components/patient/onboarding";

export function OnboardingWorkspace() {
  const workspace = useOnboardingWorkspace();
  const {
    screen,
    contactMode,
    otp,
    draft,
    referralHandle,
    handleReferralChange,
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
    programmeSearch,
    schoolPickerOpen,
    policySheet,
    setContactMode,
    setOtp,
    setSignInPassword,
    setProgrammeSearch,
    setSchoolPickerOpen,
    updateDraft,
    goBack,
    handleNext,
    handleContactSubmit,
    handleForgotPassword,
    handleFieldBlur,
    handlePhotoChange,
    handleSchoolSelect,
    handleProgrammeSelect,
    handleGradeChange,
    openCanadaSheet,
    openTermsSheet,
    closePolicySheet,
    handleChoiceContinue,
  } = workspace;

  const onStepContinue =
    screen === ONBOARDING_SCREENS.CONTACT ? handleContactSubmit : handleNext;

  return (
    <OnboardingShellContent>
      <OnboardingWorkspaceHeader
        referralHandle={referralHandle}
        onReferralChange={handleReferralChange}
      />

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
              canContinue={canAdvance}
              onContinue={onStepContinue}
              onContactModeChange={setContactMode}
              onDraftChange={updateDraft}
              onFieldBlur={handleFieldBlur}
              onOtpChange={setOtp}
              onSignInPasswordChange={setSignInPassword}
              onContactSubmit={handleContactSubmit}
              onForgotPassword={handleForgotPassword}
              onPhotoChange={handlePhotoChange}
              onProgrammeSelect={handleProgrammeSelect}
              programmeSearch={programmeSearch}
              onProgrammeSearchChange={setProgrammeSearch}
              onSchoolTypeChange={(schoolType: SchoolType) =>
                updateDraft({
                  schoolType,
                  schoolId: "",
                  schoolName: "",
                  schoolLogo: "",
                })
              }
              onSelectSchool={handleSchoolSelect}
              onOpenSchoolPicker={() => setSchoolPickerOpen(true)}
              onSchoolPickerOpenChange={setSchoolPickerOpen}
              schoolPickerOpen={schoolPickerOpen}
              selectedSchoolLogo={draft.schoolLogo}
              onGradeChange={handleGradeChange}
              onChoiceContinue={handleChoiceContinue}
              policySheet={policySheet}
              onOpenCanadaSheet={openCanadaSheet}
              onOpenTermsSheet={openTermsSheet}
              onClosePolicySheet={closePolicySheet}
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
