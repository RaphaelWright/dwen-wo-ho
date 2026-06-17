import type { LockInAssessment } from "@/lib/types/entities/lockin";
import type { PatientResult } from "@/lib/types/entities/patient";
import type { PatientActionResponseDTO } from "@/lib/types/api/patient-results";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export interface PatientHeaderProps {
  patientResult: PatientResult;
  lockInAssessment: LockInAssessment;
  onBack: () => void;
  onDelete: () => void;
}

export interface PatientMetricItem {
  name: string;
  description: string;
  value: string;
  color: string;
}

export interface PatientMetricCategory {
  name: string;
  description: string;
  score: string;
  items: PatientMetricItem[];
}

export interface PatientMetricsProps {
  metrics: PatientMetricCategory[];
}

export interface AssessmentDetailsCardProps {
  lockInAssessment: LockInAssessment;
}

export type PatientActionsTab = "assessment" | "history";

export interface PatientActionsPanelProps {
  actions: PatientActionResponseDTO[];
  isActionsLoading: boolean;
  activeTab: PatientActionsTab;
  onTabChange: (tab: PatientActionsTab) => void;
}

export interface UrgentCareStatusCardProps {
  lockInAssessment: LockInAssessment;
}

export interface SchoolTypeComparisonCardProps {
  lockInAssessment: LockInAssessment;
}

export interface CuratorPatientDetailsState {
  router: AppRouterInstance;
  patientResult: PatientResult | null;
  lockInAssessment: LockInAssessment | null;
  isLoading: boolean;
  activeTab: "assessment" | "history";
  setActiveTab: (tab: "assessment" | "history") => void;
  metrics: PatientMetricCategory[];
  actions: PatientActionResponseDTO[];
  isActionsLoading: boolean;
  showDeleteModal: boolean;
  setShowDeleteModal: (open: boolean) => void;
  singleDeletePending: boolean;
  handleDeleteConfirm: () => void;
}

export interface PatientDetailsErrorViewProps {
  onBack: () => void;
}

export interface PatientDetailsPageContentProps {
  details: CuratorPatientDetailsState;
}
