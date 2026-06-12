import type { CuratorPatientDetailsState } from "@/hooks/curator/use-curator-patient-details";

export interface PatientHeaderProps {
  patientResult: NonNullable<CuratorPatientDetailsState["patientResult"]>;
  lockInAssessment: NonNullable<CuratorPatientDetailsState["lockInAssessment"]>;
  onBack: () => void;
  onDelete: () => void;
}
