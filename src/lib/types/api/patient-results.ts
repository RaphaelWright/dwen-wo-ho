import { UrgentPatient } from "@/components/shared/urgent-card";
import type {
  ProviderSummaryDTO,
  TreatingProviderDTO,
  ActionStatus,
  VisibilityStatus,
} from "./shared";

export interface PatientResultResponse {
  id: number;
  lockinId: number;
  schoolId: number;
  schoolName: string;
  patientName: string;
  patientAge: number;
  patientSex: string;
  visibilityStatus: VisibilityStatus;
  starProvider: ProviderSummaryDTO | null;
  referredProvider: ProviderSummaryDTO | null;
  treatingProviders: TreatingProviderDTO[];
  lockinScore: number;
  comment?: string | null;
  createdAt: string;
  firstOpenedAt: string | null;
  openedByCurrentUser: boolean;
}

export interface PatientActionResponseDTO {
  id: string;
  title: string;
  subtitle?: string;
  type: string;
  date?: string;
  notes?: string;
  createdAt: string;
  providerId?: string;
  createdBy?: string;
}

export interface AddPatientActionRequest {
  title: string;
  subtitle?: string;
  type: string;
  date?: string;
  notes?: string;
}

export interface UpdateActionStatusRequest {
  providerId: string; // uuid
  actionStatus: ActionStatus;
}

export interface SetReferredProviderRequest {
  referredProviderId: string; // uuid
}

export interface PatientListResponse {
  patients: PatientCase[];
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}
export interface UrgentPatientListResponse {
  urgentPatients: UrgentPatient[];
  urgentPatientsCount: number;
}

export interface PatientCase {
  patientId: number;
  patientName: string;
  score: number;
  status: string;
  schoolId: number;
  schoolName: string;
  time: string;
  preview: string;
  avatarUrl: string | null;
  schoolNickname: string;
}

export interface VisitIncrementResponse {
  data: string;
}
