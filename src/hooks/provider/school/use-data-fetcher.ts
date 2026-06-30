"use client";

import { useCallback, useMemo } from "react";
import { toast } from "sonner";
import { providerDashboardService } from "@/services/provider/dashboard";
import { School } from "@/lib/types/entities/school";
import { SchoolWithExtras } from "@/atoms/provider-schools";
import { useProviderSchoolsSummary } from "@/hooks/queries/use-provider";
import type { ProviderSchoolsSummaryItem } from "@/lib/types/api/providers";

export function useSchoolDataFetcher(
  updateSchoolInState: (
    id: number | string,
    data: Partial<SchoolWithExtras>,
  ) => void,
  previousSchoolsRef: React.RefObject<Map<number, SchoolWithExtras>>,
) {
  const { data: schoolsSummaryData } = useProviderSchoolsSummary();

  const summaryMap = useMemo(() => {
    const map = new Map<number, ProviderSchoolsSummaryItem>();
    (schoolsSummaryData ?? []).forEach((item: ProviderSchoolsSummaryItem) =>
      map.set(item.schoolId, item),
    );
    return map;
  }, [schoolsSummaryData]);

  const fetchSchoolData = useCallback(
    async (
      school: School,
      isBackground: boolean = false,
    ): Promise<SchoolWithExtras> => {
      const schoolData: SchoolWithExtras = { ...school, isLoading: true };

      try {
        let forceRefresh = false;
        if (isBackground) {
          const prevSchool = previousSchoolsRef.current.get(Number(school.id));
          if (prevSchool?.newPatientName) {
            const newPatientCheck =
              await providerDashboardService.checkForNewPatients(
                school.id,
                prevSchool.newPatientName,
              );
            if (newPatientCheck?.hasNew && newPatientCheck.latestPatient) {
              toast.success(
                `New patient: ${newPatientCheck.latestPatient.patientName} at ${school.name}`,
              );
              forceRefresh = true;
            }
          }
        }

        const summary = summaryMap.get(Number(school.id));
        if (summary && !forceRefresh) {
          schoolData.studentCount = summary.lockinCount ?? 0;
          if (summary.latestPatientResultAt) {
            schoolData.latestLockInDate = summary.latestPatientResultAt;
          }
        } else {
          // Fallback: fetch individual APIs (no caching — React Query handles that)
          const [studentCount, latestPatient] = await Promise.all([
            providerDashboardService.getLockInCount(school.id),
            providerDashboardService.getLatestPatientResult(school.id),
          ]);
          schoolData.studentCount = studentCount;
          if (latestPatient) {
            schoolData.latestLockInDate = latestPatient.createdAt;
            schoolData.newPatientName = latestPatient.patientName;
          }
        }
      } catch (error) {
        console.error(`Error fetching data for school ${school.id}:`, error);
      }

      schoolData.isLoading = false;
      return schoolData;
    },
    [summaryMap, previousSchoolsRef],
  );

  return { fetchSchoolData };
}
