"use client";

import { ProviderSidebar } from "@/features/provider/components/ui/sidebar";
import { useProviderLayout } from "@/hooks/provider/useProviderLayout";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { ProviderLayoutProps } from "@/features/provider/types/layout";

export default function ProviderLayout({ children }: ProviderLayoutProps) {
  const {
    isAuthenticated,
    isLoading,
    mounted,
    isApproved,
    isSchoolDetailPage,
    isPatientDetailPage,
    schoolCount,
    handleLogout,
  } = useProviderLayout();

  // Show loading state only after mount to prevent hydration mismatch
  if (!mounted || isAuthenticated === null) {
    return <LoadingScreen message="Loading..." />;
  }

  if (isAuthenticated === false) {
    return null;
  }

  // Show loading state
  if (isLoading) {
    return <LoadingScreen message="Loading..." />;
  }

  // If not approved, don't show sidebar - let children handle the pending state
  if (!isApproved) {
    return <>{children}</>;
  }

  // Layout for school details page or patient details page (no sidebar)
  if (isSchoolDetailPage || isPatientDetailPage) {
    return (
      <div className="h-screen bg-white">
        <div className="h-full overflow-y-auto bg-gray-50">{children}</div>
      </div>
    );
  }

  // Show sidebar and content when approved
  return (
    <div className="h-screen bg-white flex">
      <ProviderSidebar schoolCount={schoolCount} onLogout={handleLogout} />
      <div className="flex-1 overflow-y-auto bg-gray-50 pt-16 md:pt-0">
        {children}
      </div>
    </div>
  );
}
