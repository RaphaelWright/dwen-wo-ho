"use client";

import { useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { schoolsService } from "@/services/schools";
import { lockinsService } from "@/services/lockins";
import { patientsService } from "@/services/patients";
import useUserQuery from "@/hooks/queries/useUserProfile";
import { toast } from "@/components/ui/sonner";

import { LockInData, LockInStudent } from "@/lib/types/lockin";
import { PatientResult } from "@/lib/types/patient";
import { School } from "@/lib/types/school";

// ─── Fetchers ────────────────────────────────────────────────────────────────

async function fetchSchoolDetail(schoolId: string): Promise<School | null> {
  try {
    return await schoolsService.getSchool(schoolId);
  } catch {
    return null;
  }
}

async function fetchStudents(schoolId: string): Promise<LockInStudent[]> {
  let lockInData;
  try {
    lockInData = await lockinsService.getSchoolLockIn(schoolId);
  } catch {
    return [];
  }

  if (!lockInData) return [];

  let studentsList = lockInData.students || [];

  try {
    const resultsResponse = await patientsService.getSchoolResults(schoolId);
    if (resultsResponse && Array.isArray(resultsResponse)) {
      const results = resultsResponse;

      const resultMap = new Map<string, PatientResult>();
      results.forEach((result: PatientResult) => {
        resultMap.set(result.patientName, result);
      });

      studentsList = studentsList.map((student) => {
        const result = resultMap.get(student.studentName);
        if (result) {
          return {
            ...student,
            lockinId: result.lockinId,
            createdAt: result.createdAt,
            patientResultId: result.id,
            visibilityStatus: result.visibilityStatus,
          };
        }
        return student;
      });
    }
  } catch {
    // Silently handle errors when fetching patient results
  }

  studentsList.sort((a, b) => {
    if (a.createdAt && b.createdAt) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (a.createdAt) return -1;
    if (b.createdAt) return 1;
    return a.studentName.localeCompare(b.studentName);
  });

  return studentsList;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useProviderSchoolDetails() {
  const params = useParams();
  const router = useRouter();
  const schoolId = params.schoolId as string;
  const { getProfileQuery } = useUserQuery();
  const queryClient = useQueryClient();

  const [accessDenied, setAccessDenied] = useState(false);
  const studentsRef = useRef<LockInStudent[]>([]);

  // Check access
  const providerSchools = getProfileQuery.data?.schools || [];
  const schoolsArray = Array.isArray(providerSchools) ? providerSchools : [];
  const hasAccess = schoolsArray.some(
    (s: { id: string | number }) => String(s.id) === String(schoolId),
  );

  const isReady = !!schoolId && !!getProfileQuery.data;

  // School details query
  const schoolQuery = useQuery({
    queryKey: ["provider-school-detail", schoolId],
    queryFn: async () => {
      try {
        return await fetchSchoolDetail(schoolId);
      } catch (error) {
        if (error instanceof Error) {
          const isAccessDenied =
            error.message.includes("not permitted") ||
            error.message.includes("not allowed");
          if (isAccessDenied) {
            if (!hasAccess) {
              router.replace("/provider/schools");
              return null;
            }
            setAccessDenied(true);
            return null;
          }
        }
        return null;
      }
    },
    enabled: isReady && hasAccess,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,
  });

  // Students query
  const studentsQuery = useQuery({
    queryKey: ["provider-school-students", schoolId],
    queryFn: async () => {
      const result = await fetchStudents(schoolId);
      studentsRef.current = result;
      return result;
    },
    enabled: isReady && hasAccess,
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000,
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

      try {
        const resultsResponse = await patientsService.getSchoolResults(schoolId);
        if (resultsResponse && Array.isArray(resultsResponse)) {
          const results = resultsResponse;
          const existingResult = results.find(
            (r: PatientResult) => r.patientName === student.studentName,
          );
          if (existingResult) {
            router.push(`/provider/patients/${existingResult.id}`);
            return;
          }
        }
      } catch (error) {
        console.error("Failed to check existing results:", error);
      }

      if (student.lockinId) {
        try {
          const response = await patientsService.createPatientResult({
            lockinId: student.lockinId,
            schoolId: Number(schoolId),
          });

          if (response?.success) {
            const updatedResults = await patientsService.getSchoolResults(schoolId);
            if (updatedResults && Array.isArray(updatedResults)) {
              const results = updatedResults;
              const result = results.find(
                (r: PatientResult) => r.patientName === student.studentName,
              );
              if (result) {
                router.push(`/provider/patients/${result.id}`);
              } else {
                // Refetch students via React Query
                await queryClient.invalidateQueries({
                  queryKey: ["provider-school-students", schoolId],
                });
                const studentAfterReload = studentsRef.current.find(
                  (s) => s.studentName === student.studentName,
                );
                if (studentAfterReload?.patientResultId) {
                  router.push(
                    `/provider/patients/${studentAfterReload.patientResultId}`,
                  );
                }
              }
            }
          }
        } catch (error) {
          console.error("Failed to create patient result:", error);
          toast.error("Failed to create patient result. Please try again.");
        }
      } else {
        toast.error("Unable to open patient. Lock-in ID not found.");
      }
    },
    [schoolId, router, queryClient],
  );

  return {
    router,
    school: schoolQuery.data ?? null,
    students: studentsQuery.data ?? [],
    isLoading: schoolQuery.isLoading,
    studentsLoading: studentsQuery.isLoading,
    accessDenied,
    handleStudentClick,
  };
}
