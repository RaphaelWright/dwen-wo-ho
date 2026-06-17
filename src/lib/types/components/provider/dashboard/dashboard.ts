import type { UrgentPatient } from "@/lib/types/entities/patient";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type { ProviderProfileResponse } from "@/lib/types/api/auth";

export interface ProviderDashboardShellProps<TDashboard = unknown> {
  dashboard: TDashboard;
  onUrgentPatientClick: (patient: UrgentPatient) => void;
}

export interface ProviderDashboardOverlayHostProps<TDashboard = unknown> {
  dashboard: TDashboard;
  isApproved: boolean;
  isAuthLoading: boolean;
  authProfile: ProviderProfileResponse | undefined;
  onLogout: () => void;
  router: AppRouterInstance;
}
