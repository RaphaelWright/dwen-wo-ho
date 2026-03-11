"use client";

import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { schoolsService } from "@/services/schools";
import { lockinsService } from "@/services/lockins";
import { patientsService } from "@/services/patients";
import { SchoolProvider } from "@/lib/types/provider";
import { SchoolPatientRecord } from "@/lib/types/components/curator/school-details";

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const schoolDetailKeys = {
  all: ["school-detail"] as const,
  patients: (schoolId: string) =>
    [...schoolDetailKeys.all, "patients", schoolId] as const,
  providers: (schoolId: string) =>
    [...schoolDetailKeys.all, "providers", schoolId] as const,
  urgentCare: (schoolId: string) =>
    [...schoolDetailKeys.all, "urgent-care", schoolId] as const,
};

// ─── Fetch Functions ─────────────────────────────────────────────────────────

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

// ─── Query Hook ──────────────────────────────────────────────────────────────
export default function useSchoolDetailsQuery(schoolId: string) {
  const queryClient = useQueryClient();

  const patientsQuery = useQuery({
    queryKey: schoolDetailKeys.patients(schoolId),
    queryFn: () => fetchSchoolPatients(schoolId),
    enabled: !!schoolId,
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const providersQuery = useQuery({
    queryKey: schoolDetailKeys.providers(schoolId),
    queryFn: () => fetchSchoolProviders(schoolId),
    enabled: !!schoolId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const urgentCareQuery = useQuery({
    queryKey: schoolDetailKeys.urgentCare(schoolId),
    queryFn: () => fetchSchoolUrgentCare(schoolId),
    enabled: !!schoolId,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const invalidateSchoolProviders = useCallback(
    () =>
      queryClient.invalidateQueries({
        queryKey: schoolDetailKeys.providers(schoolId),
      }),
    [queryClient, schoolId],
  );

  return {
    patientsQuery,
    providersQuery,
    urgentCareQuery,
    invalidateSchoolProviders,
  };
}
