"use client";

import { useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { patientsService } from "@/services/shared/patients";
import useUserQuery from "@/hooks/queries/use-user-profile";
import useSchoolsQuery from "@/hooks/queries/use-schools";
import usePatientResultQuery from "@/hooks/queries/use-patient-result";
import { toast } from "sonner";
import { LockInStudent } from "@/lib/types/entities/lockin";

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useProviderSchoolDetails() {
  const params = useParams();
  const router = useRouter();
  const schoolId = params.schoolId as string;
  const { getProfileQuery } = useUserQuery();
  const { useSchool, useSchoolStudents } = useSchoolsQuery();
  const { createPatientResult } = usePatientResultQuery();

  // Check access
  const providerSchools = getProfileQuery.data?.schools || [];
  const schoolsArray = Array.isArray(providerSchools) ? providerSchools : [];
  const hasAccess = schoolsArray.some(
    (s: { id: string | number }) => String(s.id) === String(schoolId),
  );

  const isReady = !!schoolId && !!getProfileQuery.data;

  // School details query
  const schoolQuery = useSchool(schoolId);

  // Students query
  const studentsQuery = useSchoolStudents(schoolId, {
    enabled: isReady && hasAccess,
  });

  // Redirect if no access
  if (isReady && !hasAccess) {
    router.replace("/provider/schools");
  }

  const handleStudentClick = useCallback(
    async (student: LockInStudent) => {
      if (student.patientResultId) {
        router.push(`/provider/patients/${student.patientResultId}`);
        return;
      }

      // Check if result already exists (e.g. created by another provider)
      try {
        const results = await patientsService.getSchoolResults(schoolId);
        const existingResult = results.find(
          (r) => r.patientName === student.studentName,
        );
        if (existingResult) {
          router.push(`/provider/patients/${existingResult.id}`);
          return;
        }
      } catch (error) {
        console.error("Failed to check existing results:", error);
      }

      if (student.lockinId) {
        try {
          const response = await createPatientResult({
            lockinId: student.lockinId,
            schoolId: Number(schoolId),
          });

          if (response) {
            // Patient results query will be invalidated by createPatientResult mutation success handler
            // We can refetch/wait for invalidation or just manually check again
            const updatedResults =
              await patientsService.getSchoolResults(schoolId);
            const result = updatedResults.find(
              (r) => r.patientName === student.studentName,
            );
            if (result) {
              router.push(`/provider/patients/${result.id}`);
            } else {
              toast.error("Result created but not found. Please refresh.");
            }
          }
        } catch (error) {
          console.error("Failed to create patient result:", error);
        }
      } else {
        toast.error("Unable to open patient. Lock-in ID not found.");
      }
    },
    [schoolId, router, createPatientResult],
  );

  return {
    router,
    school: schoolQuery.data ?? null,
    students: studentsQuery.data ?? [],
    isLoading: schoolQuery.isLoading,
    studentsLoading: studentsQuery.isLoading,
    accessDenied: isReady && !hasAccess,
    handleStudentClick,
  };
}
