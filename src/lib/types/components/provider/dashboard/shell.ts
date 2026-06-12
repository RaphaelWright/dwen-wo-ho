import type { ProviderDashboardState } from "@/hooks/provider/use-provider-dashboard";
import type { UrgentPatient } from "@/components/shared/urgent-card";

export interface ProviderDashboardShellProps {
  dashboard: ProviderDashboardState;
  onUrgentPatientClick: (patient: UrgentPatient) => void;
}
