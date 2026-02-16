export interface PatientResult {
  id: number;
  lockinId: number;
  schoolId: number;
  schoolName: string;
  patientName: string;
  patientAge: number;
  patientSex: string;
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
  lockinScore?: number;
}

export interface PatientResultItem {
  id: number;
  lockinId: number;
  patientName: string;
  createdAt: string;
  visibilityStatus: string;
  treatingProviders: Array<{ id: string; fullName: string }>;
  lockinScore?: number;
  comment?: string | null;
}

export interface UrgentCarePatient {
  lockinId?: number;
  patientResultId?: number;
  patientName?: string;
  patientAge?: number;
  patientSex?: string;
  lockedInScore?: number;
  lockinDate?: string;
  urgentCareEnteredAt?: string;
  createdAt?: string;
  [key: string]: unknown;
}


