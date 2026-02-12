"use client";

import { useRouter, usePathname } from "next/navigation";
import { ProviderSidebar } from "@/features/provider/components/ui/sidebar";
import { ROUTES } from "@/constants/routes";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import useUserQuery from "@/hooks/queries/useUserQuery";
import { performLogout } from "@/lib/auth-utils";
import { hasValidToken } from "@/lib/utils/getUserType";

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [mounted, setMounted] = useState(false);
  const [schoolCount, setSchoolCount] = useState(0);

  const { getProfileQuery } = useUserQuery({
    enabled: mounted,
  });

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      if (!hasValidToken()) {
        router.replace(ROUTES.provider.auth);
        setIsAuthenticated(false);
        return;
      }

      setIsAuthenticated(true);
    }
  }, [router]);

  useEffect(() => {
    if (getProfileQuery.data) {
      const data = getProfileQuery.data;
      // Get school count from provider data
      const schools = data.schools || [];
      setSchoolCount(Array.isArray(schools) ? schools.length : 0);
    }
  }, [getProfileQuery.data]);

  const handleLogout = () => {
    performLogout(queryClient, ROUTES.provider.auth);
  };

  // Check if current page is school details page or patient details page
  const isSchoolDetailPage = pathname?.match(/\/provider\/schools\/\d+$/);
  const isPatientDetailPage = pathname?.match(/\/provider\/patients\/\d+$/);

  // Show loading state only after mount to prevent hydration mismatch
  if (!mounted || isAuthenticated === null) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#955aa4] mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return null;
  }

  // Only show sidebar and content if provider is approved
  const isApproved = getProfileQuery.data?.applicationStatus === "APPROVED";
  const isLoading = getProfileQuery.isLoading;

  // Show loading state
  if (isLoading) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#955aa4] mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // If not approved, don't show sidebar - let children handle the pending state
  if (!isApproved && getProfileQuery.data) {
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
