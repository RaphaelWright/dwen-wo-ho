"use client";

import {
  OnboardingAuthFooter,
  OnboardingPhaseFooter,
} from "@/components/patient/onboarding/workspace/footers";
import { OnboardingHostToast } from "@/components/patient/onboarding/host-toast";
import { OnboardingWorkspaceHeader } from "@/components/patient/onboarding/workspace/header";
import { OnboardingStepContent } from "@/components/patient/onboarding/workspace/step-content";
import { OnboardingShellContent } from "@/components/patient/onboarding/shell";
import { useOnboardingWorkspace } from "@/hooks/components/patient/onboarding/workspace/use-onboarding-workspace";
import { ONBOARDING_SCREENS } from "@/lib/constants/components/patient/onboarding";
import type { SchoolType } from "@/lib/types/components/patient/onboarding";
import { cn } from "@/lib/utils";

export function OnboardingWorkspace() {
  const workspace = useOnboardingWorkspace();
  const {
    screen,
    contactMode,
    verifyFlow,
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
    authStepperLabels,
    hideAuthFooterNext,
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
    hostToastMessage,
    hostToastVisible,
  } = workspace;

  const onStepContinue =
    screen === ONBOARDING_SCREENS.CONTACT ? handleContactSubmit : handleNext;

  return (
    <OnboardingShellContent>
      <OnboardingWorkspaceHeader
        referralHandle={referralHandle}
        onReferralChange={handleReferralChange}
      />

      <OnboardingStepContent
        screen={screen}
        contactMode={contactMode}
        verifyFlow={verifyFlow}
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

      <div className={cn("auth-footer", !showAuthFooter && "hidden")}>
        <OnboardingAuthFooter
          stepLabel={authStepLabel}
          showStepper={showAuthStepper}
          stepLabels={authStepperLabels}
          hideNext={hideAuthFooterNext}
          backDisabled={backDisabled}
          nextDisabled={!canAdvance}
          nextLabel={nextLabel}
          onBack={goBack}
          onNext={handleNext}
        />
      </div>

      <div className={cn("footer-bar", !showOnboardingFooter && "hidden")}>
        <OnboardingPhaseFooter
          stepLabel={onboardingStepLabel}
          completedSteps={completedOnboardingSteps}
          backDisabled={backDisabled}
          nextDisabled={!canAdvance}
          nextLabel={nextLabel}
          onBack={goBack}
          onNext={handleNext}
        />
      </div>

      <OnboardingHostToast
        message={hostToastMessage}
        visible={hostToastVisible}
      />
    </OnboardingShellContent>
  );
}
