export interface ProviderLayoutProps {
  children: React.ReactNode;
}

export type MobilePanel = "schools" | "patients" | "urgent";

export interface UseProviderLayoutReturn {
  isAuthenticated: boolean | null;
  isLoading: boolean;
  mounted: boolean;
  isApproved: boolean;
  isSchoolDetailPage: boolean;
  isPatientDetailPage: boolean;
  schoolCount: number;
  handleLogout: () => void;
}
