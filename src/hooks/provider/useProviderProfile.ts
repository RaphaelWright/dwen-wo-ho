"use client";

import { useState, useEffect } from "react";
import useUserQuery from "@/hooks/queries/useUserQuery";
import {
  ProviderProfile,
  ProviderStats,
} from "@/features/provider/types/profile";

export function useProviderProfile() {
  const { getProfileQuery } = useUserQuery();
  const [stats, setStats] = useState<ProviderStats>({
    schools: 0,
    partners: 0,
    totalStudents: 0,
    pendingStudents: 0,
  });

  useEffect(() => {
    if (getProfileQuery.data) {
      const data = getProfileQuery.data as ProviderProfile;
      const schools = data.schools || [];
      const partners = data.partners || [];

      setStats({
        schools: Array.isArray(schools) ? schools.length : 0,
        partners: Array.isArray(partners) ? partners.length : 0,
        totalStudents: 0, // TODO: Get from API
        pendingStudents: 0, // TODO: Get from API
      });
    }
  }, [getProfileQuery.data]);

  return {
    provider: getProfileQuery.data as ProviderProfile | undefined,
    isLoading: getProfileQuery.isLoading,
    stats,
  };
}
