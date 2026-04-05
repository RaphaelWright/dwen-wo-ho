import type { ProviderSummaryDTO } from "./shared";

export interface SchoolResponse {
  id: number;
  name: string;
  nickname: string;
  type: string;
  motto?: string;
  baseline?: number;
  campuses?: string[];
  logo?: string;
  totalProviders?: number;
  totalPartners?: number;
  createdAt?: string;
}

export interface SchoolProvidersResponse {
  id: number;
  name: string;
  logo?: string;
  totalProviders: number;
  providers: SchoolProviderItem[];
}

export interface SchoolProviderItem {
  id: string;
  email: string;
  providerName: string;
  providerTitle?: string;
  specialty?: string;
  profilePhotoURL?: string;
  applicationStatus?: string;
  isAssociated?: boolean;
}

export interface SchoolPartnersResponse {
  id: number;
  name: string;
  logo?: string;
  totalPartners: number;
  partners: SchoolPartnerItem[];
}

export interface SchoolPartnerItem {
  id: string;
  name: string;
  logo?: string;
  isAssociated?: boolean;
}

export interface SchoolReachResponse {
  schoolName: string;
  reach: number;
}

export interface PatientsOverviewResponse {
  patients: import("./patient-results").PatientResultResponse[];
  urgentCare: import("./lockin").UrgentCareListLightResponse;
}

// Suppress unused import warning — ProviderSummaryDTO is part of the domain model for this file
// and may be used by consumers who import from this module.
export type { ProviderSummaryDTO };
