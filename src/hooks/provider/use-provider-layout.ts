"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import useUserQuery from "@/hooks/queries/use-user-profile";
import { useAuthQuery } from "@/hooks/queries/use-auth";
import { hasValidToken } from "@/lib/utils/getUserType";
import { ROUTES } from "@/lib/constants/routes";
import { UseProviderLayoutReturn } from "@/lib/types/provider/layout";

export function useProviderLayout(): UseProviderLayoutReturn {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuthQuery();
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
    logout(ROUTES.provider.auth);
  };

  // Check if current page is school details page or patient details page
  const isSchoolDetailPage = !!pathname?.match(/\/provider\/schools\/\d+$/);
  const isPatientDetailPage = !!pathname?.match(/\/provider\/patients\/\d+$/);

  const isApproved = getProfileQuery.data?.applicationStatus === "APPROVED";

  return {
    isAuthenticated,
    isLoading: getProfileQuery.isLoading,
    mounted,
    isApproved,
    isSchoolDetailPage,
    isPatientDetailPage,
    schoolCount,
    handleLogout,
  };
}
