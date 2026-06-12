import type { CuratorPatientDetailsState } from "@/hooks/curator/use-curator-patient-details";

export interface PatientMetricsProps {
  metrics: CuratorPatientDetailsState["metrics"];
}
