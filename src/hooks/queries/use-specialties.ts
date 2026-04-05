"use client";

import { useQuery } from "@tanstack/react-query";
import { specialtiesService } from "@/services/specialties";
import { QUERY_KEYS } from "@/lib/constants/query-keys";
import { PROVIDER_SPECIALTIES } from "@/lib/constants/components/provider/auth/signup";

export const useSpecialties = () => {
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.specialties],
    queryFn: specialtiesService.list,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 2 * 60 * 60 * 1000,
  });

  // Map API response to display names; fall back to hardcoded list if API is empty
  const specialties: string[] =
    data && data.length > 0
      ? data.map((s) => s.specialty)
      : PROVIDER_SPECIALTIES;

  return { specialties, isLoading };
};
