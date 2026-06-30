import type {
  AuthFooterStepLabel,
  ContactMode,
  HomeProfilePreview,
  OnboardingDraft,
  OnboardingFooterStepLabel,
  OnboardingPhase,
  OnboardingScreen,
} from "@/lib/types/components/patient/onboarding";
import {
  AUTH_FOOTER_STEP_BY_SCREEN,
  ONBOARDING_DOB_DEFAULT_YEAR,
  ONBOARDING_FOOTER_STEP_BY_SCREEN,
  ONBOARDING_FOOTER_STEP_LABELS,
  ONBOARDING_INITIAL_DRAFT,
  ONBOARDING_SCREENS,
  AUTH_FOOTER_STEP_LABELS,
} from "@/lib/constants/components/patient/onboarding";
import { composeFullName } from "@/lib/utils/patient/onboarding-format";
import {
  computeGraduationYear,
  formatStudentClassSummary,
} from "@/lib/utils/patient/onboarding-class";

export function getAuthFooterStepLabel(
  screen: OnboardingScreen,
): AuthFooterStepLabel {
  return AUTH_FOOTER_STEP_BY_SCREEN[screen] ?? AUTH_FOOTER_STEP_LABELS[0];
}

export function getOnboardingFooterStepLabel(
  screen: OnboardingScreen,
): OnboardingFooterStepLabel {
  return (
    ONBOARDING_FOOTER_STEP_BY_SCREEN[screen] ?? ONBOARDING_FOOTER_STEP_LABELS[0]
  );
}

export function getOnboardingCompletedSteps(
  draft: OnboardingDraft,
): OnboardingFooterStepLabel[] {
  const completed: OnboardingFooterStepLabel[] = [];
  if (draft.schoolId && draft.schoolName) {
    completed.push("Campus");
  }
  if (draft.programme.trim() || draft.programmeTags.length > 0) {
    completed.push("Programme");
  }
  if (draft.gradeShort) {
    completed.push("Class");
  }
  return completed;
}

export function getOnboardingPhaseForScreen(
  screen: OnboardingScreen,
): OnboardingPhase {
  return screen === ONBOARDING_SCREENS.SCHOOL_TYPE ||
    screen === ONBOARDING_SCREENS.PROGRAMME ||
    screen === ONBOARDING_SCREENS.GRADE
    ? "onboarding"
    : "auth";
}

export function syncDraftDerivedFields(
  draft: OnboardingDraft,
): OnboardingDraft {
  const referenceYear = new Date().getFullYear();
  const classSummary = draft.gradeShort
    ? formatStudentClassSummary({
        gradeShort: draft.gradeShort,
        yearsRemaining: draft.gradeYearsRemaining,
        programme: draft.programme,
        schoolName: draft.schoolName,
        referenceYear,
      })
    : null;
  const graduationYear = draft.gradeShort
    ? computeGraduationYear(draft.gradeYearsRemaining, referenceYear)
    : null;

  return {
    ...draft,
    fullName: composeFullName(draft.firstName, draft.lastName),
    school: draft.schoolName || draft.school,
    educationLevel: draft.schoolType,
    year: classSummary ?? "",
    graduationYearOffset:
      graduationYear !== null ? String(graduationYear - referenceYear) : "",
    birthYear: draft.birthYear || ONBOARDING_DOB_DEFAULT_YEAR,
  };
}

export function usesFooterContinue(screen: OnboardingScreen): boolean {
  return (
    screen !== ONBOARDING_SCREENS.CONTACT &&
    screen !== ONBOARDING_SCREENS.CHOICE
  );
}

export function buildHomeProfilePreview(
  draft: OnboardingDraft,
  contactMode: ContactMode,
): HomeProfilePreview {
  const referenceYear = new Date().getFullYear();

  return {
    nickname: draft.nickname,
    fullName: draft.fullName,
    profilePhotoUrl: draft.profilePhotoUrl,
    gender: draft.gender,
    phone: draft.phone,
    email: draft.email,
    birthYear: draft.birthYear,
    gradeShort: draft.gradeShort,
    graduationYear: draft.gradeShort
      ? computeGraduationYear(draft.gradeYearsRemaining, referenceYear)
      : null,
    programme: draft.programme,
    schoolName: draft.schoolName,
    contactMode,
  };
}

export function mergeStoredOnboardingDraft(
  patch: Partial<OnboardingDraft>,
): OnboardingDraft {
  return syncDraftDerivedFields({
    ...ONBOARDING_INITIAL_DRAFT,
    ...patch,
  } as OnboardingDraft);
}

export function hasCampusOnboardingData(
  draft: Partial<OnboardingDraft>,
): boolean {
  return Boolean(draft.schoolName?.trim() || draft.school?.trim());
}
