import { ProviderNotification } from "../notification";
import type { PatientCase } from "./patient-results";
import type { ProviderAssociatedSchool } from "./providers";

export interface ProviderProfileData {
  title: string;
  name: string;
  specialty: string;
  status: string;
  phone: string;
  avatarUrl: string;
  email: string;
  memberSince: string;
  lastUpdated: string | null;
  ranking?: string; // frontend-only computed field
}

export interface ProviderDashboardInitResponse {
  profile: ProviderProfileData;
  schools: ProviderAssociatedSchool[];
  patients: PatientCase[];
  notifications: {
    items: ProviderNotification[];
    unreadCount: number;
  };
}

export interface ProviderUpdateProfileRequest {
  fieldKey: "title" | "name" | "specialty" | "status" | "phone";
  value: string;
}

export interface ProviderUpdatePatientStatusRequest {
  status: string;
}

export interface ProviderPatientsParams {
  schoolId?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}
