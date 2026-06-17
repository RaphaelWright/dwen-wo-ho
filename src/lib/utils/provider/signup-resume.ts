import { ROUTES } from "@/lib/constants/routes";
import type {
  ProviderProfileResumeInput,
  ProviderSignupProfileStepIndex,
  ProviderSignupProfileStepSlug,
} from "@/lib/types/components/provider/signup-resume";

const PROFILE_STEP_SLUGS: ProviderSignupProfileStepSlug[] = [
  "photo",
  "bio",
  "specialty",
];

function getProviderProfilePhotoUrl(
  userData: ProviderProfileResumeInput,
): string | undefined {
  return userData.profileURL || userData.profilePhotoURL || undefined;
}

export function getProviderProfileResumeStep(
  userData: ProviderProfileResumeInput,
): ProviderSignupProfileStepSlug | null {
  if (!getProviderProfilePhotoUrl(userData)) {
    return "photo";
  }
  if (!userData.officePhoneNumber) {
    return "bio";
  }
  if (!userData.specialty?.trim()) {
    return "specialty";
  }
  return null;
}

export function profileStepSlugToIndex(
  slug: ProviderSignupProfileStepSlug,
): ProviderSignupProfileStepIndex {
  const index = PROFILE_STEP_SLUGS.indexOf(slug);
  return (index >= 0 ? index : 0) as ProviderSignupProfileStepIndex;
}

export function isProviderSignupProfileStepSlug(
  value: string | null | undefined,
): value is ProviderSignupProfileStepSlug {
  return value === "photo" || value === "bio" || value === "specialty";
}

export function buildProviderSignupResumeUrl(
  email: string,
  slug: ProviderSignupProfileStepSlug,
): string {
  return `${ROUTES.provider.signUp}?email=${encodeURIComponent(email)}&step=${slug}`;
}

export function hasProviderAuthToken(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return Boolean(
    localStorage.getItem("token") || localStorage.getItem("refreshToken"),
  );
}

export function isProfileIncompleteError(message: string): boolean {
  return message.includes("Profile is not complete");
}

export function parseProfileIncompleteStepFromMessage(
  message: string,
): ProviderSignupProfileStepSlug {
  if (message.includes("upload your profile photo")) {
    return "photo";
  }
  if (message.includes("office phone number")) {
    return "bio";
  }
  if (message.includes("add your specialty")) {
    return "specialty";
  }
  return "photo";
}

export function clearProviderAuthStorage(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("token");
  localStorage.removeItem("curatorToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("pendingUser:v1");
}
