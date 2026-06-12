import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type { ProviderProfileResponse } from "@/lib/types/api/auth";
import type { ProviderDashboardState } from "@/hooks/provider/use-provider-dashboard";

export interface ProviderDashboardModalsProps {
  dashboard: ProviderDashboardState;
  isApproved: boolean;
  isAuthLoading: boolean;
  authProfile: ProviderProfileResponse | undefined;
  onLogout: () => void;
  router: AppRouterInstance;
}
