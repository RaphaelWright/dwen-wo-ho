"use client";

import { useOnboardingWizard } from "@/hooks/components/patient/onboarding/wizard/use-onboarding-wizard";
import {
  AUTH_FOOTER_STEP_LABELS,
  ONBOARDING_COPY,
  ONBOARDING_SCREENS,
  RECOVERY_FOOTER_STEP_LABELS,
} from "@/lib/constants/components/patient/onboarding";
import type { OnboardingScreen } from "@/lib/types/components/patient/onboarding";
import {
  getAuthFooterStepLabel,
  getOnboardingCompletedSteps,
  getOnboardingFooterStepLabel,
  usesFooterContinue,
} from "@/lib/utils/patient/onboarding-validation";
import { isOnboardingScreenValid } from "@/lib/utils/patient/onboarding-screen-validation";

const SIGNUP_AUTH_STEPPER_SCREENS: ReadonlySet<OnboardingScreen> = new Set([
  ONBOARDING_SCREENS.CREATE_ACCOUNT,
  ONBOARDING_SCREENS.VERIFY,
]);

const RECOVERY_AUTH_STEPPER_SCREENS: ReadonlySet<OnboardingScreen> = new Set([
  ONBOARDING_SCREENS.VERIFY,
  ONBOARDING_SCREENS.NEW_PASSWORD,
]);

const AUTH_FOOTER_SCREENS: ReadonlySet<OnboardingScreen> = new Set([
  ONBOARDING_SCREENS.CREATE_ACCOUNT,
  ONBOARDING_SCREENS.VERIFY,
  ONBOARDING_SCREENS.PROFILE_PHOTO,
  ONBOARDING_SCREENS.NEW_PASSWORD,
]);

const ONBOARDING_FOOTER_SCREENS: ReadonlySet<OnboardingScreen> = new Set([
  ONBOARDING_SCREENS.SCHOOL_TYPE,
  ONBOARDING_SCREENS.PROGRAMME,
  ONBOARDING_SCREENS.GRADE,
]);

export function useOnboardingWorkspace() {
  const wizard = useOnboardingWizard();
  const {
    screen,
    contactMode,
    verifyFlow,
    otp,
    draft,
    signInPassword,
    goNext,
    goBack,
    handleContactSubmit,
  } = wizard;

  const canAdvance = isOnboardingScreenValid(
    screen,
    draft,
    otp,
    signInPassword,
    contactMode,
  );
  const showAuthFooter = AUTH_FOOTER_SCREENS.has(screen);
  const showAuthStepper =
    verifyFlow === "recovery"
      ? RECOVERY_AUTH_STEPPER_SCREENS.has(screen)
      : SIGNUP_AUTH_STEPPER_SCREENS.has(screen);
  const authStepperLabels =
    verifyFlow === "recovery"
      ? RECOVERY_FOOTER_STEP_LABELS
      : AUTH_FOOTER_STEP_LABELS;
  const hideAuthFooterNext = screen === ONBOARDING_SCREENS.VERIFY;
  const showOnboardingFooter = ONBOARDING_FOOTER_SCREENS.has(screen);
  const authStepLabel = getAuthFooterStepLabel(screen);
  const onboardingStepLabel = getOnboardingFooterStepLabel(screen);
  const completedOnboardingSteps = getOnboardingCompletedSteps(draft);

  const isLastStep = screen === ONBOARDING_SCREENS.GRADE;

  const nextLabel =
    screen === ONBOARDING_SCREENS.GRADE
      ? ONBOARDING_COPY.grade.submit
      : screen === ONBOARDING_SCREENS.SIGN_IN
        ? ONBOARDING_COPY.signIn.continue
        : screen === ONBOARDING_SCREENS.NEW_PASSWORD
          ? ONBOARDING_COPY.newPassword.continue
          : "Next";

  const backDisabled =
    screen === ONBOARDING_SCREENS.CHOICE ||
    screen === ONBOARDING_SCREENS.CONTACT;

  const handleNext = () => {
    if (!canAdvance) {
      return;
    }
    goNext();
  };

  const handleProgrammeSelect = (programme: {
    name: string;
    tags: readonly string[];
    durationYears: number;
  }) => {
    wizard.updateDraft({
      programme: programme.name,
      programmeTags: [...programme.tags],
      programmeDurationYears: programme.durationYears,
      gradeShort: "",
      gradeYearsRemaining: 0,
    });
  };

  const handleGradeChange = (grade: {
    short: string;
    yearsRemaining: number;
  }) => {
    wizard.updateDraft({
      gradeShort: grade.short,
      gradeYearsRemaining: grade.yearsRemaining,
    });
  };

  const handlePhotoChange = (url: string, file: File | null) => {
    wizard.updateDraft({ profilePhotoUrl: url, profilePhotoFile: file });
  };

  return {
    ...wizard,
    canAdvance,
    showAuthFooter,
    showAuthStepper,
    authStepperLabels,
    hideAuthFooterNext,
    showOnboardingFooter,
    showFooterContinue: usesFooterContinue(screen),
    authStepLabel,
    onboardingStepLabel,
    completedOnboardingSteps,
    isLastStep,
    nextLabel,
    backDisabled,
    handleNext,
    handleContactSubmit,
    handleProgrammeSelect,
    handleGradeChange,
    programmeSearch: wizard.programmeSearch,
    setProgrammeSearch: wizard.setProgrammeSearch,
    schoolPickerOpen: wizard.schoolPickerOpen,
    setSchoolPickerOpen: wizard.setSchoolPickerOpen,
    selectedSchoolLogo: draft.schoolLogo,
    policySheet: wizard.policySheet,
    openCanadaSheet: wizard.openCanadaSheet,
    openTermsSheet: wizard.openTermsSheet,
    closePolicySheet: wizard.closePolicySheet,
    handleChoiceContinue: wizard.handleChoiceContinue,
    handlePhotoChange,
    handleSchoolSelect: wizard.handleSchoolSelect,
    goBack,
  };
}
