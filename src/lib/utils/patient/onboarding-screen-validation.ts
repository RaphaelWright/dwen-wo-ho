import type {
  ContactMode,
  FieldValidationKey,
  FieldValidationState,
  OnboardingDraft,
  OnboardingScreen,
} from "@/lib/types/components/patient/onboarding";
import { ONBOARDING_SCREENS } from "@/lib/constants/components/patient/onboarding";
import { evaluatePasswordStrength } from "@/lib/utils/shared/password-strength";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isOnboardingPasswordValid(password: string): boolean {
  const { requirements } = evaluatePasswordStrength(password);
  return Object.values(requirements).every(Boolean);
}

function validatePhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 9 && digits.length <= 10;
}

function validateEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

const FIELD_VALIDATORS: Record<
  FieldValidationKey,
  (draft: OnboardingDraft) => FieldValidationState
> = {
  phone: (draft) => {
    if (!draft.phone.trim()) return "idle";
    return validatePhone(draft.phone) ? "valid" : "invalid";
  },
  email: (draft) => {
    if (!draft.email.trim()) return "idle";
    return validateEmail(draft.email) ? "valid" : "invalid";
  },
  password: (draft) => {
    if (!draft.password) return "idle";
    return isOnboardingPasswordValid(draft.password) ? "valid" : "invalid";
  },
  confirmPassword: (draft) => {
    if (!draft.confirmPassword) return "idle";
    return draft.confirmPassword === draft.password ? "valid" : "invalid";
  },
};

export function getFieldValidationState(
  field: FieldValidationKey,
  draft: OnboardingDraft,
): FieldValidationState {
  return FIELD_VALIDATORS[field](draft);
}

type ScreenValidationContext = {
  draft: OnboardingDraft;
  otp: string;
  signInPassword: string;
  contactMode: ContactMode;
};

const SCREEN_VALIDATORS: Record<
  OnboardingScreen,
  (context: ScreenValidationContext) => boolean
> = {
  [ONBOARDING_SCREENS.CONTACT]: ({ draft, contactMode }) =>
    contactMode === "phone"
      ? validatePhone(draft.phone)
      : validateEmail(draft.email),
  [ONBOARDING_SCREENS.CREATE_ACCOUNT]: ({ draft }) =>
    draft.firstName.trim().length > 0 &&
    draft.lastName.trim().length > 0 &&
    draft.nickname.trim().length > 0 &&
    Boolean(draft.gender) &&
    Boolean(draft.birthMonth) &&
    Boolean(draft.birthDay) &&
    Boolean(draft.birthYear) &&
    isOnboardingPasswordValid(draft.password) &&
    draft.confirmPassword === draft.password,
  [ONBOARDING_SCREENS.VERIFY]: ({ otp }) => otp.length === 6,
  [ONBOARDING_SCREENS.PROFILE_PHOTO]: ({ draft }) =>
    Boolean(draft.profilePhotoUrl),
  [ONBOARDING_SCREENS.SIGN_IN]: ({ signInPassword }) =>
    signInPassword.trim().length > 0,
  [ONBOARDING_SCREENS.FORGOT_PASSWORD]: () => true,
  [ONBOARDING_SCREENS.NEW_PASSWORD]: ({ draft }) =>
    isOnboardingPasswordValid(draft.password) &&
    draft.confirmPassword === draft.password,
  [ONBOARDING_SCREENS.SCHOOL_TYPE]: ({ draft }) =>
    Boolean(draft.schoolType && draft.schoolId && draft.schoolName),
  [ONBOARDING_SCREENS.PROGRAMME]: ({ draft }) =>
    Boolean(draft.programme.trim() || draft.programmeTags.length > 0),
  [ONBOARDING_SCREENS.GRADE]: ({ draft }) => Boolean(draft.gradeShort),
};

export function isOnboardingScreenValid(
  screen: OnboardingScreen,
  draft: OnboardingDraft,
  otp: string,
  signInPassword: string,
  contactMode: ContactMode,
): boolean {
  return SCREEN_VALIDATORS[screen]({
    draft,
    otp,
    signInPassword,
    contactMode,
  });
}
