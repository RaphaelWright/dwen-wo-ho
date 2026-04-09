import type { TreatingProviderDTO } from "./api/shared";

export interface PatientResult {
  id: number;
  lockinId: number;
  schoolId: number;
  schoolName: string;
  patientName: string;
  patientAge: number;
  patientSex: string;
  patientLevel: string;
  visibilityStatus: "NEW" | "SEEN";
  starProvider: {
    id: string;
    fullName: string;
    email: string;
    professionalTitle: string;
    specialty: string;
  } | null;
  referredProvider: {
    id: string;
    fullName: string;
    email: string;
    professionalTitle: string;
    specialty: string;
  } | null;
  createdAt: string;
  firstOpenedAt: string | null;
  openedByCurrentUser: boolean;
  treatingProviders: Array<{
    id: string;
    fullName: string;
  }>;
  // Optional fields for list views
  comment?: string | null;
  lockinScore: number;
}

export interface UrgentCarePatient {
  id: number;
  lockinId?: number;
  schoolId?: number;
  patientResultId?: number;
  patientName: string;
  patientAge?: number;
  patientSex?: string;
  lockedInScore?: number;
  lockinDate?: string;
  urgentCareEnteredAt?: string;
  createdAt?: string;
  isTreating?: boolean;
  treatingProviders?: TreatingProviderDTO[];
}
