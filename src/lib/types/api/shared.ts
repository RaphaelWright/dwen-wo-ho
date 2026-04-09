export type ActionStatus = "NONE" | "TREATING" | "REFERRED";
export type VisibilityStatus = "NEW" | "SEEN";

export interface ProviderSummaryDTO {
  id: string; // uuid
  fullName: string;
  email: string;
  professionalTitle: string;
  specialty: string;
}

export interface TreatingProviderDTO {
  id: string;
  fullName: string;
}

export interface ApiSuccessResponse<T = unknown> {
  success: boolean;
  data: T;
  message: string;
}
