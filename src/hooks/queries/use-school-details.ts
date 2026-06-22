"use client";

import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { schoolsService } from "@/services/curator/schools";
import { SchoolProvider } from "@/lib/types/entities/provider";
import { QUERY_KEYS } from "@/lib/constants/infra/query-keys";

async function fetchSchoolProviders(
  schoolId: string,
): Promise<SchoolProvider[]> {
  return schoolsService.getSchoolProviders(schoolId);
}

export default function useSchoolDetailsQuery(schoolId: string) {
  const queryClient = useQueryClient();

  const { data: patientsOverviewData, isLoading: patientsOverviewLoading } =
    useQuery({
      queryKey: QUERY_KEYS.schoolPatientsOverview(schoolId),
      queryFn: () => schoolsService.getPatientsOverview(schoolId),
      enabled: !!schoolId,
      staleTime: 2 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    });

  const { data: providersData, isLoading: providersLoading } = useQuery({
    queryKey: QUERY_KEYS.schoolProviders(schoolId),
    queryFn: () => fetchSchoolProviders(schoolId),
    enabled: !!schoolId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const invalidateSchoolProviders = useCallback(
    () =>
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.schoolProviders(schoolId),
      }),
    [queryClient, schoolId],
  );

  return {
    patientsOverviewData,
    patientsOverviewLoading,
    providersData,
    providersLoading,
    invalidateSchoolProviders,
  };
}
