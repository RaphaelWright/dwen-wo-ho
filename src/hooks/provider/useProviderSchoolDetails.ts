"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ENDPOINTS } from "@/lib/constants/endpoints";
import useUserQuery from "@/hooks/queries/useUserQuery";
import { toast } from "sonner";

import { LockInData, LockInStudent } from "@/lib/types/lockin";
import { PatientResult } from "@/lib/types/patient";
import { School } from "@/lib/types/school";

export function useProviderSchoolDetails() {
  const params = useParams();
  const router = useRouter();
  const schoolId = params.schoolId as string;
  const { getProfileQuery } = useUserQuery();

  const [school, setSchool] = useState<School | null>(null);
  const [students, setStudents] = useState<LockInStudent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const studentsRef = useRef<LockInStudent[]>([]);

  const loadSchoolDetails = useCallback(async () => {
    setIsLoading(true);
    setAccessDenied(false);
    try {
      const response = await api(ENDPOINTS.school(schoolId));
      if (response?.success && response.data) {
        setSchool(response.data);
      }
    } catch (error) {
      if (error instanceof Error) {
        try {
          const errorData = JSON.parse(error.message);
          const isAccessDenied =
            errorData.message?.includes("not permitted") ||
            errorData.message?.includes("not allowed") ||
            errorData.message?.includes("You're not permitted");

          if (isAccessDenied) {
            const providerSchools = getProfileQuery.data?.schools || [];
            const schoolsArray = Array.isArray(providerSchools)
              ? providerSchools
              : [];
            const hasAccess = schoolsArray.some(
              (s: { id: string | number }) => String(s.id) === String(schoolId),
            );

            if (!hasAccess) {
              router.replace("/provider/schools");
              return;
            }

            setAccessDenied(true);
            setSchool(null);
            return;
          }
        } catch {
          if (
            error.message.includes("not permitted") ||
            error.message.includes("not allowed")
          ) {
            const providerSchools = getProfileQuery.data?.schools || [];
            const schoolsArray = Array.isArray(providerSchools)
              ? providerSchools
              : [];
            const hasAccess = schoolsArray.some(
              (s: { id: string | number }) => String(s.id) === String(schoolId),
            );

            if (!hasAccess) {
              router.replace("/provider/schools");
              return;
            }

            setAccessDenied(true);
            setSchool(null);
            return;
          }
        }
      }
      setSchool(null);
    } finally {
      setIsLoading(false);
    }
  }, [schoolId, getProfileQuery.data, router]);

  const loadStudents = useCallback(async () => {
    setStudentsLoading(true);
    try {
      const lockInResponse = await api(ENDPOINTS.getSchoolLockIn(schoolId));
      if (lockInResponse?.success && lockInResponse.data) {
        const lockInData = lockInResponse.data as LockInData;
        let studentsList = lockInData.students || [];

        try {
          const resultsResponse = await api(
            ENDPOINTS.getSchoolPatientResults(schoolId),
          );
          if (resultsResponse?.success && resultsResponse.data) {
            const results = Array.isArray(resultsResponse.data)
              ? resultsResponse.data
              : [];

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
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          }
          if (a.createdAt) return -1;
          if (b.createdAt) return 1;
          return a.studentName.localeCompare(b.studentName);
        });

        setStudents(studentsList);
        studentsRef.current = studentsList;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      if (!errorMessage.includes("No lockins found")) {
        // Only log unexpected errors
      }
      setStudents([]);
      studentsRef.current = [];
    } finally {
      setStudentsLoading(false);
    }
  }, [schoolId]);

  const handleStudentClick = useCallback(
    async (student: LockInStudent) => {
      if (student.patientResultId) {
        router.push(`/provider/patients/${student.patientResultId}`);
        return;
      }

      try {
        const resultsResponse = await api(
          ENDPOINTS.getSchoolPatientResults(schoolId),
        );
        if (resultsResponse?.success && resultsResponse.data) {
          const results = Array.isArray(resultsResponse.data)
            ? resultsResponse.data
            : [];
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
          const response = await api(ENDPOINTS.createPatientResult, {
            method: "POST",
            body: JSON.stringify({
              lockinId: student.lockinId,
              schoolId: Number(schoolId),
            }),
          });

          if (response?.success) {
            const updatedResults = await api(
              ENDPOINTS.getSchoolPatientResults(schoolId),
            );
            if (updatedResults?.success && updatedResults.data) {
              const results = Array.isArray(updatedResults.data)
                ? updatedResults.data
                : [];
              const result = results.find(
                (r: PatientResult) => r.patientName === student.studentName,
              );
              if (result) {
                router.push(`/provider/patients/${result.id}`);
              } else {
                await loadStudents();
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
    [schoolId, router, loadStudents],
  );

  useEffect(() => {
    if (schoolId && getProfileQuery.data) {
      const providerSchools = getProfileQuery.data.schools || [];
      const schoolsArray = Array.isArray(providerSchools)
        ? providerSchools
        : [];
      const hasAccess = schoolsArray.some(
        (s: { id: string | number }) => String(s.id) === String(schoolId),
      );

      if (!hasAccess) {
        router.replace("/provider/schools");
        return;
      }

      loadSchoolDetails();
      loadStudents();
    }
  }, [schoolId, getProfileQuery.data, router, loadSchoolDetails, loadStudents]);

  return {
    router,
    school,
    students,
    isLoading,
    studentsLoading,
    accessDenied,
    handleStudentClick,
  };
}
