export type ProviderOnboardingNextStep = "photo" | "phone" | "specialty" | null;

export interface SignInUserData {
  userRole: string;
  providerName: string;
  specialty: string;
  officePhoneNumber: string;
  applicationStatus: "PENDING" | "APPROVED" | "REJECTED";
  profileURL: string;
  applicationTimestamp: string;
  title: string;
  status: string;
  email?: string;
  nextStep?: ProviderOnboardingNextStep;
}

export interface SignInResponse {
  token: string;
  refreshToken: string;
  userData: SignInUserData;
}

export interface CheckEmailResponse {
  emailExists: boolean;
  message: string;
}

export interface TokenResponse {
  token: string;
  refreshToken?: string;
}

export interface AddPhotoResponse {
  profilePhotoUrl: string;
}

export interface ProviderProfileResponse {
  id: string;
  email: string;
  officePhoneNumber?: string;
  phoneNumber?: string;
  status?: string;
  applicationStatus?: "PENDING" | "APPROVED" | "REJECTED" | "ACTIVE";
  providerName?: string;
  professionalTitle?: string;
  specialty?: string;
  profilePhotoURL?: string;
  profileURL?: string;
  title?: string;
  applicationDate?: string;
  isVerified?: boolean;
  nextStep?: ProviderOnboardingNextStep;
  [key: string]: unknown;
}

/**
 * Narrowed view of the provider profile query shared between the profile hook
 * and its consumers. Only the fields actually read downstream are exposed so
 * the query result can be destructured (preserving TanStack's tracked-property
 * optimization) instead of passing the whole query object around.
 */
export interface ProfileQueryHandle {
  data: ProviderProfileResponse | undefined;
  isLoading: boolean;
}
