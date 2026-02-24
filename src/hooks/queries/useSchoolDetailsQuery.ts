"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ENDPOINTS } from "@/lib/constants/endpoints";
import { PatientResultItem, UrgentCarePatient } from "@/lib/types/patient";
import { LockInStudent } from "@/lib/types/lockin";
import { SchoolProvider } from "@/lib/types/provider";

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

// ─── Data Fetchers ───────────────────────────────────────────────────────────

interface PatientsData {
  patients: PatientResultItem[];
  lockinStudents: LockInStudent[];
  patientComments: Record<number, string | null>;
}

async function fetchSchoolPatients(schoolId: string): Promise<PatientsData> {
  const [resResults, resLockIn] = await Promise.all([
    api(ENDPOINTS.getSchoolPatientResults(schoolId)),
    api(ENDPOINTS.getSchoolLockIn(schoolId)).catch(() => null),
  ]);

  let patients: PatientResultItem[] = [];
  let lockinStudents: LockInStudent[] = [];
  const patientComments: Record<number, string | null> = {};

  if (resResults?.success && resResults.data) {
    const list = Array.isArray(resResults.data) ? resResults.data : [];

    list.sort(
      (a: { createdAt: string }, b: { createdAt: string }) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    patients = list.map(
      (p: {
        id: number;
        lockinId: number;
        patientName: string;
        createdAt: string;
        visibilityStatus: string;
        treatingProviders?: Array<{ id: string; fullName: string }>;
      }) => ({
        id: p.id,
        lockinId: p.lockinId,
        patientName: p.patientName,
        createdAt: p.createdAt,
        visibilityStatus: p.visibilityStatus,
        treatingProviders: p.treatingProviders ?? [],
      }),
    );
  }

  if (
    resLockIn?.success &&
    (resLockIn.data as { students?: LockInStudent[] })?.students
  ) {
    lockinStudents = (resLockIn.data as { students: LockInStudent[] }).students;
  }

  // Fetch comments for first 15 patients
  if (patients.length > 0) {
    const first = patients.slice(0, 15);
    await Promise.all(
      first.map(async (p) => {
        try {
          const update = await api(ENDPOINTS.getLockInUpdate(p.lockinId));
          if (
            update?.success &&
            (update.data as { comment?: string | null })?.comment != null
          ) {
            patientComments[p.lockinId] = (
              update.data as { comment: string }
            ).comment;
          }
        } catch {
          // ignore
        }
      }),
    );
  }

  return { patients, lockinStudents, patientComments };
}

async function fetchSchoolProviders(
  schoolId: string,
): Promise<SchoolProvider[]> {
  const response = await api(ENDPOINTS.schoolProviders(schoolId));
  if (response?.success && response.data) {
    const data = response.data as { providers?: SchoolProvider[] };
    return data.providers || [];
  }
  const direct = response as { providers?: SchoolProvider[] };
  if (direct?.providers) return direct.providers;
  return [];
}

interface UrgentCareData {
  totalUrgentCarePatients: number;
  patients: UrgentCarePatient[];
}

async function fetchSchoolUrgentCare(
  schoolId: string,
): Promise<UrgentCareData> {
  const response = await api(ENDPOINTS.getUrgentCare(schoolId));
  if (response?.success && response.data) {
    const data = response.data as {
      totalUrgentCarePatients?: number;
      patients?: UrgentCarePatient[];
    };
    return {
      totalUrgentCarePatients: data.totalUrgentCarePatients ?? 0,
      patients: data.patients ?? [],
    };
  }
  return { totalUrgentCarePatients: 0, patients: [] };
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
