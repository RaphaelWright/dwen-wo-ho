export type ProviderSignupProfileStepSlug = "photo" | "bio" | "specialty";

export type ProviderSignupProfileStepIndex = 0 | 1 | 2;

export interface ProviderProfileResumeInput {
  profileURL?: string;
  profilePhotoURL?: string;
  officePhoneNumber?: string;
  specialty?: string;
  email?: string;
}

export interface ProviderSignupGuardState {
  isChecking: boolean;
  isResumeLocked: boolean;
  profileStep: number | null;
}
