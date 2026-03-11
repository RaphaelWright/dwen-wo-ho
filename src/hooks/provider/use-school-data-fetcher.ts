"use client";

import { useCallback, useRef } from "react";
import { toast } from "@/components/ui/sonner";
import {
  getSchoolLockInCount,
  getLatestPatientResult,
  checkForNewPatients,
} from "@/lib/school-api-utils";
import { School } from "@/lib/types/school";
import { SchoolWithExtras } from "@/atoms/provider-schools";

export function useSchoolDataFetcher(
  updateSchoolInState: (id: number | string, data: Partial<SchoolWithExtras>) => void,
  previousSchoolsRef: React.MutableRefObject<Map<number, SchoolWithExtras>>,
) {
  const fetchSchoolData = useCallback(
    async (
      school: School,
      isBackground: boolean = false,
    ): Promise<SchoolWithExtras> => {
      const schoolData: SchoolWithExtras = { ...school, isLoading: true };

      try {
        // Check for new patients only during background updates
        let forceRefresh = false;
        if (isBackground) {
          const prevSchool = previousSchoolsRef.current.get(Number(school.id));

          if (prevSchool?.newPatientName) {
            const newPatientCheck = await checkForNewPatients(
              school.id,
              prevSchool.newPatientName,
            );

            if (newPatientCheck?.hasNew && newPatientCheck.latestPatient) {
              toast.success(
                `New patient: ${newPatientCheck.latestPatient.patientName} at ${school.name}`,
              );
              forceRefresh = true; // Force cache refresh to get updated counts
            }
          }
        }

        // Parallel fetch of lock-in count and latest patient (skip cache if new patient detected)
        const [studentCount, latestPatient] = await Promise.all([
          forceRefresh
            ? getSchoolLockInCount(school.id, true) // Force fresh data
            : getSchoolLockInCount(school.id),
          forceRefresh
            ? getLatestPatientResult(school.id, true) // Force fresh data
            : getLatestPatientResult(school.id),
        ]);

        schoolData.studentCount = studentCount;

        if (latestPatient) {
          schoolData.latestLockInDate = latestPatient.createdAt;
          schoolData.newPatientName = latestPatient.patientName;
        }
      } catch (error) {
        console.error(`Error fetching data for school ${school.id}:`, error);
      }

      schoolData.isLoading = false;
      return schoolData;
    },
    [],
  );

  return { fetchSchoolData };
}