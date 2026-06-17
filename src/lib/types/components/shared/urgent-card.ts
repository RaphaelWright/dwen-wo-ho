import type { UrgentPatient } from "@/lib/types/entities/patient";

export interface UrgentCardProps {
  patient: UrgentPatient;
  index: number;
  onClick?: (patient: UrgentPatient) => void;
}

export interface UrgentCardMetaProps {
  patient: UrgentPatient;
}
