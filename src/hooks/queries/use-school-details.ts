"use client";

import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { schoolsService } from "@/services/schools";
import { lockinsService } from "@/services/lockins";
import { patientsService } from "@/services/patients";
import { SchoolProvider } from "@/lib/types/provider";
import { SchoolPatientRecord } from "@/lib/types/components/curator/school-details";
import { QUERY_KEYS } from "@/lib/constants/query-keys";

async function fetchSchoolPatients(
  schoolId: string,
): Promise<SchoolPatientRecord[]> {
  const data = await patientsService.getSchoolResults(schoolId);
  const list = data as unknown as SchoolPatientRecord[];

  if (list && list.length > 0) {
    list.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  return list || [];
}

async function fetchSchoolProviders(
  schoolId: string,
): Promise<SchoolProvider[]> {
  return schoolsService.getSchoolProviders(schoolId);
}

async function fetchSchoolUrgentCare(schoolId: string) {
  return lockinsService.getSchoolUrgentCare(schoolId);
}

export default function useSchoolDetailsQuery(schoolId: string) {
  const queryClient = useQueryClient();

  const patientsOverviewQuery = useQuery({
    queryKey: QUERY_KEYS.schoolPatientsOverview(schoolId),
    queryFn: () => schoolsService.getPatientsOverview(schoolId),
    enabled: !!schoolId,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const providersQuery = useQuery({
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
    patientsOverviewQuery,
    providersQuery,
    invalidateSchoolProviders,
  };
}
