import { PatientResult } from "@/types/patient";
import { LockInAssessment } from "@/types/lockin";

export interface PatientResultHeaderProps {
  patientResult: PatientResult;
  isTreating: boolean;
}

export interface PatientInfoCardProps {
  patientResult: PatientResult;
}

export interface ProviderInfoCardProps {
  patientResult: PatientResult;
}

export interface LockInAssessmentCardProps {
  lockInAssessment: LockInAssessment;
  getColorClass: (color: string) => string;
}
