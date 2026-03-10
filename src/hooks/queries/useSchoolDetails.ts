"use client";

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

async function fetchSchoolPatients(
  schoolId: string,
): Promise<SchoolPatientRecord[]> {
  const data = await patientsService.getSchoolResults(schoolId);
  const list = (data as unknown) as SchoolPatientRecord[];
  
  if (list && list.length > 0) {
    list.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  return list || [];
}

async function fetchSchoolProviders(
  schoolId: string,
): Promise<SchoolProvider[]> {
  return schoolsService.getSchoolProviders(schoolId);
}

async function fetchSchoolUrgentCare(
  schoolId: string,
) {
  return lockinsService.getSchoolUrgentCare(schoolId);
}

// ─── Query Hooks ─────────────────────────────────────────────────────────────

export function useSchoolPatients(schoolId: string) {
  return useQuery({
    queryKey: schoolDetailKeys.patients(schoolId),
    queryFn: () => fetchSchoolPatients(schoolId),
    enabled: !!schoolId,
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes in cache
  });
}

export function useSchoolProviders(schoolId: string) {
  return useQuery({
    queryKey: schoolDetailKeys.providers(schoolId),
    queryFn: () => fetchSchoolProviders(schoolId),
    enabled: !!schoolId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,
  });
}

export function useSchoolUrgentCare(schoolId: string) {
  return useQuery({
    queryKey: schoolDetailKeys.urgentCare(schoolId),
    queryFn: () => fetchSchoolUrgentCare(schoolId),
    enabled: !!schoolId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Returns a function to invalidate and refetch providers for a given school.
 * Useful after modal callbacks that modify provider associations.
 */
export function useInvalidateSchoolProviders() {
  const queryClient = useQueryClient();
  return (schoolId: string) =>
    queryClient.invalidateQueries({
      queryKey: schoolDetailKeys.providers(schoolId),
    });
}
