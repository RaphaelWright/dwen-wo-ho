import type { BackendNotification } from "./shared";
import type { AssociatedSchool } from "./providers";
import type { PatientCase, PatientListResponse } from "./patient-results";

export interface ProfileData {
  title: string;
  name: string;
  specialty: string;
  status: string;
  phone: string;
  avatarUrl: string;
  email: string;
  memberSince: string;
  lastUpdated: string | null;
}

export interface NotificationsData {
  items: BackendNotification[];
  unreadCount: number;
}

export interface DashboardInitResponse {
  profile: ProfileData;
  schools: AssociatedSchool[];
  patients: PatientCase[];
  notifications: NotificationsData;
}

export interface UpdateProfileRequest {
  fieldKey: "title" | "name" | "specialty" | "status" | "phone";
  value: string;
}

export interface UpdatePatientStatusRequest {
  status: string;
}

export interface ProviderPatientsParams {
  schoolId?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// Re-export for convenience
export type { PatientCase, PatientListResponse };
