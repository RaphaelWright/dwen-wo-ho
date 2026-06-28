import type { ReactNode } from "react";
import type {
  AUTH_FOOTER_STEP_LABELS,
  ONBOARDING_FOOTER_STEP_LABELS,
  ONBOARDING_SCREENS,
} from "@/lib/constants/components/patient/onboarding";

export type OnboardingScreen =
  (typeof ONBOARDING_SCREENS)[keyof typeof ONBOARDING_SCREENS];

export type OnboardingPhase = "auth" | "onboarding";

export type AuthPath = "signup" | "signin" | "recovery";

export type ContactMode = "phone" | "email";

export type SchoolType = "high-school" | "college";

export type GenderValue = "female" | "male" | "";

export type VerifyFlow = "signup" | "recovery";

export type FieldValidationState = "idle" | "valid" | "invalid";

export type FieldValidationKey =
  | "phone"
  | "email"
  | "password"
  | "confirmPassword";

export interface OnboardingDraft {
  phone: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  nickname: string;
  gender: GenderValue;
  birthMonth: string;
  birthDay: string;
  birthYear: string;
  password: string;
  confirmPassword: string;
  profilePhotoUrl: string;
  profilePhotoFile: File | null;
  schoolId: string;
  schoolName: string;
  schoolType: SchoolType;
  programme: string;
  programmeTags: string[];
  gradeShort: string;
  graduationYearOffset: string;
  educationLevel: SchoolType;
  school: string;
  year: string;
}

export interface PatientOnboardingLayoutProps {
  children: ReactNode;
}

export interface OnboardingShellProps {
  children: ReactNode;
}

export interface OnboardingShellContentProps {
  children: ReactNode;
}

export interface OnboardingSocialProof {
  name: string;
  quote: string;
  programme: string;
  school: string;
  rating: number;
  ratingLabel: string;
}

export interface TestimonialQuoteProps {
  quote: string;
}

export interface StudentMetaProps {
  programme: string;
  school: string;
}

export interface RatingBadgeProps {
  rating: number;
  label: string;
}

export interface OnboardingHeaderProps {
  referralHandle: string | null;
}

export type AuthFooterStepLabel = (typeof AUTH_FOOTER_STEP_LABELS)[number];

export type OnboardingFooterStepLabel =
  (typeof ONBOARDING_FOOTER_STEP_LABELS)[number];

export interface OnboardingFooterBaseProps {
  backDisabled: boolean;
  nextDisabled: boolean;
  nextLabel: string;
  onBack: () => void;
  onNext: () => void;
}

export interface AuthFooterProps extends OnboardingFooterBaseProps {
  stepLabel: AuthFooterStepLabel;
  showStepper?: boolean;
}

export interface OnboardingPhaseFooterProps extends OnboardingFooterBaseProps {
  stepLabel: OnboardingFooterStepLabel;
  completedSteps: OnboardingFooterStepLabel[];
}

export interface StepShellProps {
  title: string;
  subtitle?: ReactNode;
  centered?: boolean;
  children: ReactNode;
}

export interface PhoneFieldProps {
  value: string;
  validationState: FieldValidationState;
  onChange: (value: string) => void;
  onBlur: () => void;
}

export interface EmailFieldProps {
  value: string;
  validationState: FieldValidationState;
  onChange: (value: string) => void;
  onBlur: () => void;
}

export interface ContactStepProps {
  contactMode: ContactMode;
  draft: OnboardingDraft;
  fieldValidation: Record<FieldValidationKey, FieldValidationState>;
  onContactModeChange: (mode: ContactMode) => void;
  onDraftChange: (patch: Partial<OnboardingDraft>) => void;
  onFieldBlur: (field: FieldValidationKey) => void;
  onSubmit: () => void;
}

export interface CreateAccountStepProps {
  contactValue: string;
  contactMode: ContactMode;
  draft: OnboardingDraft;
  fieldValidation: Record<FieldValidationKey, FieldValidationState>;
  onDraftChange: (patch: Partial<OnboardingDraft>) => void;
  onFieldBlur: (field: FieldValidationKey) => void;
}

export interface VerifyStepProps {
  contactValue: string;
  otp: string;
  onOtpChange: (value: string) => void;
}

export interface ProfilePhotoStepProps {
  profilePhotoUrl: string;
  onPhotoChange: (url: string, file: File | null) => void;
}

export interface SignInStepProps {
  nickname: string;
  password: string;
  validationState: FieldValidationState;
  onPasswordChange: (value: string) => void;
  onBlur: () => void;
  onForgotPassword: () => void;
}

export interface ForgotPasswordStepProps {
  contactValue: string;
}

export interface NewPasswordStepProps {
  password: string;
  confirmPassword: string;
  fieldValidation: Record<FieldValidationKey, FieldValidationState>;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onFieldBlur: (field: FieldValidationKey) => void;
}

export interface SchoolComboboxItem {
  value: string;
  label: string;
  logo?: string;
  type?: string;
}

export interface SchoolComboboxProps {
  schoolType: SchoolType;
  selectedSchoolId: string;
  disabled?: boolean;
  onSelectSchool: (school: { id: string; name: string }) => void;
}

export interface SchoolTypeStepProps {
  schoolType: SchoolType;
  selectedSchoolId: string;
  onSchoolTypeChange: (type: SchoolType) => void;
  onSelectSchool: (school: { id: string; name: string }) => void;
}

export interface ProgrammeComboboxItem {
  value: string;
  label: string;
}

export interface ProgrammeComboboxProps {
  selectedProgramme: string;
  disabled?: boolean;
  onSelectProgramme: (programme: string) => void;
}

export interface ProgrammeStepProps {
  programme: string;
  onProgrammeChange: (value: string) => void;
}

export interface GradeStepProps {
  schoolType: SchoolType;
  gradeShort: string;
  programme: string;
  schoolName: string;
  onGradeChange: (grade: string) => void;
}

export interface OnboardingStepContentProps {
  screen: OnboardingScreen;
  contactMode: ContactMode;
  draft: OnboardingDraft;
  otp: string;
  signInPassword: string;
  fieldValidation: Record<FieldValidationKey, FieldValidationState>;
  onContactModeChange: (mode: ContactMode) => void;
  onDraftChange: (patch: Partial<OnboardingDraft>) => void;
  onFieldBlur: (field: FieldValidationKey) => void;
  onOtpChange: (value: string) => void;
  onSignInPasswordChange: (value: string) => void;
  onContactSubmit: () => void;
  onForgotPassword: () => void;
  onPhotoChange: (url: string, file: File | null) => void;
  onProgrammeChange: (programme: string) => void;
  onSchoolTypeChange: (type: SchoolType) => void;
  onSelectSchool: (school: { id: string; name: string }) => void;
  onGradeChange: (grade: string) => void;
}

export interface ContactFieldSubmitProps {
  children: ReactNode;
  onSubmit: () => void;
}

export interface HomeProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nickname: string;
}

export interface DobFieldProps {
  birthMonth: string;
  birthDay: string;
  birthYear: string;
  onChange: (
    patch: Partial<
      Pick<OnboardingDraft, "birthMonth" | "birthDay" | "birthYear">
    >,
  ) => void;
}
