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
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface AddPhotoResponse {
  profilePhotoUrl: string;
}

export interface ProviderProfileResponse {
  id: string;
  email: string;
  officePhoneNumber?: string;
  status?: string;
  [key: string]: unknown;
}
