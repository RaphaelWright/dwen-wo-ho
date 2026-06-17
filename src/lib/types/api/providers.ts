export interface ProviderResponse {
  id: string;
  email: string;
  fullName?: string;
  providerName?: string;
  professionalTitle?: string;
  providerTitle?: string;
  specialty?: string;
  specialties?: string[];
  officePhoneNumber?: string;
  applicationStatus?: "PENDING" | "APPROVED" | "REJECTED";
  profilePhotoURL?: string;
  status?: string;
  bio?: string;
  lastActive?: string;
  applicationDate?: string;
}

export interface ProviderAssociatedSchool {
  schoolId: number;
  schoolName: string;
  count: number;
  hasNotif: boolean;
  avatarUrl: string | null;
  primaryColor: string | null;
}

export interface ProviderAssociatedPartner {
  id: string;
  name: string;
  logo?: string;
  isAssociated?: boolean;
  joinedDate?: string;
}

export interface ProviderDetailResponse {
  provider: ProviderResponse;
  associatedSchools: ProviderAssociatedSchool[];
  availableSchools: ProviderAssociatedSchool[];
  associatedPartners: ProviderAssociatedPartner[];
}

export interface ProviderSchoolsSummaryItem {
  schoolId: number;
  schoolName: string;
  lockinCount?: number;
  latestPatientResultAt?: string;
  urgentCareCount?: number;
  [key: string]: unknown;
}

export interface LatestSchoolPatientResult {
  id: number;
  patientName: string;
  createdAt: string;
}

export interface SchoolNewPatientCheck {
  hasNew: boolean;
  latestPatient?: Pick<LatestSchoolPatientResult, "patientName" | "createdAt">;
}

export interface ProviderActivityParams {
  schoolId?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ProviderActivityItem {
  id: string | number;
  providerEmail?: string;
  providerName?: string;
  action?: string;
  details?: string;
  schoolId?: number;
  schoolName?: string;
  status?: string;
  timestamp?: string;
  [key: string]: unknown;
}

export interface ProviderActivityListResponse {
  items: ProviderActivityItem[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}
