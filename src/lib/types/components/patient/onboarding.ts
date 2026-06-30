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
  schoolLogo: string;
  schoolType: SchoolType;
  programme: string;
  programmeTags: string[];
  programmeDurationYears: number;
  gradeShort: string;
  gradeYearsRemaining: number;
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

export interface OnboardingReferralPickerProps {
  referralHandle: string | null;
  onReferralChange: (handle: string | null) => void;
}

export type OnboardingHeaderProps = OnboardingReferralPickerProps;

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
  submitDisabled: boolean;
}

export interface EmailFieldProps {
  value: string;
  validationState: FieldValidationState;
  onChange: (value: string) => void;
  onBlur: () => void;
  submitDisabled: boolean;
}

export interface ChoiceStepProps {
  contactMode: ContactMode;
  onContactModeChange: (mode: ContactMode) => void;
  onContinue: () => void;
}

export interface ContactStepProps {
  contactMode: ContactMode;
  draft: OnboardingDraft;
  fieldValidation: Record<FieldValidationKey, FieldValidationState>;
  onDraftChange: (patch: Partial<OnboardingDraft>) => void;
  onFieldBlur: (field: FieldValidationKey) => void;
  onSubmit: () => void;
  onOpenCanadaSheet: () => void;
  onOpenTermsSheet: () => void;
}

export interface CreateAccountStepProps extends OnboardingStepContinueProps {
  contactValue: string;
  contactMode: ContactMode;
  draft: OnboardingDraft;
  fieldValidation: Record<FieldValidationKey, FieldValidationState>;
  onDraftChange: (patch: Partial<OnboardingDraft>) => void;
  onFieldBlur: (field: FieldValidationKey) => void;
}

export interface VerifyStepProps extends OnboardingStepContinueProps {
  contactValue: string;
  otp: string;
  onOtpChange: (value: string) => void;
}

export interface ProfilePhotoStepProps extends OnboardingStepContinueProps {
  profilePhotoUrl: string;
  onPhotoChange: (url: string, file: File | null) => void;
}

export interface SignInStepProps extends OnboardingStepContinueProps {
  nickname: string;
  password: string;
  validationState: FieldValidationState;
  onPasswordChange: (value: string) => void;
  onBlur: () => void;
  onForgotPassword: () => void;
}

export interface ForgotPasswordStepProps extends OnboardingStepContinueProps {
  contactValue: string;
}

export interface NewPasswordStepProps extends OnboardingStepContinueProps {
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

export interface SchoolTypeStepProps extends OnboardingStepContinueProps {
  schoolType: SchoolType;
  selectedSchoolId: string;
  selectedSchoolName: string;
  selectedSchoolLogo?: string;
  pickerOpen: boolean;
  onSchoolTypeChange: (type: SchoolType) => void;
  onOpenPicker: () => void;
  onPickerOpenChange: (open: boolean) => void;
  onSelectSchool: (school: { id: string; name: string; logo?: string }) => void;
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

export interface OnboardingFieldBoxProps {
  label: string;
  validationState?: FieldValidationState;
  children: ReactNode;
  className?: string;
}

export interface OnboardingFieldSubmitButtonProps {
  disabled?: boolean;
}

export interface OnboardingStepContinueProps {
  canContinue: boolean;
  onContinue: () => void;
}

export interface OnboardingContinueFormProps extends OnboardingStepContinueProps {
  children: ReactNode;
  className?: string;
  /** Listen for Enter when the step has no text inputs (e.g. grade selection). */
  listenForEnter?: boolean;
}

export interface SchoolPickerProps {
  open: boolean;
  schoolType: SchoolType;
  onOpenChange: (open: boolean) => void;
  onSelectSchool: (school: { id: string; name: string; logo?: string }) => void;
}

export interface SchoolPickerCardProps {
  id: string;
  name: string;
  logo?: string;
  nickname?: string;
  motto?: string;
  studentCount: number;
  onSelect: () => void;
}

export interface SchoolContextPillProps {
  schoolName: string;
  schoolLogo?: string;
  schoolType: SchoolType;
  onChangeSchool: () => void;
}

export interface ProgrammeStepProps extends OnboardingStepContinueProps {
  programme: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onProgrammeSelect: (programme: {
    name: string;
    tags: readonly string[];
    durationYears: number;
  }) => void;
}

export interface GradeStepProps extends OnboardingStepContinueProps {
  schoolType: SchoolType;
  gradeShort: string;
  programme: string;
  schoolName: string;
  programmeDurationYears: number;
  onGradeChange: (grade: { short: string; yearsRemaining: number }) => void;
}

export interface PolicySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant: "canada-us" | "terms";
}

export interface HomeProfilePreview {
  nickname: string;
  fullName: string;
  profilePhotoUrl: string;
  gender: string;
  phone: string;
  email: string;
  birthYear: string;
  gradeShort: string;
  graduationYear: number | null;
  programme: string;
  schoolName: string;
  contactMode: ContactMode;
}

export interface HomeProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preview: HomeProfilePreview | null;
}

export interface OnboardingStepContentProps extends OnboardingStepContinueProps {
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
  onProgrammeSelect: (programme: {
    name: string;
    tags: readonly string[];
    durationYears: number;
  }) => void;
  onOpenSchoolPicker: () => void;
  onSchoolPickerOpenChange: (open: boolean) => void;
  schoolPickerOpen: boolean;
  selectedSchoolLogo?: string;
  onSelectSchool: (school: { id: string; name: string; logo?: string }) => void;
  onGradeChange: (grade: { short: string; yearsRemaining: number }) => void;
  onSchoolTypeChange: (type: SchoolType) => void;
  onChoiceContinue: () => void;
  programmeSearch: string;
  onProgrammeSearchChange: (value: string) => void;
  policySheet: "canada-us" | "terms" | null;
  onOpenCanadaSheet: () => void;
  onOpenTermsSheet: () => void;
  onClosePolicySheet: () => void;
}

export interface ContactFieldSubmitProps {
  children: ReactNode;
  onSubmit: () => void;
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
