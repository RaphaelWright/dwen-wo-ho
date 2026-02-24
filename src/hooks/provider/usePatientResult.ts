"use client";

import { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ENDPOINTS } from "@/lib/constants/endpoints";
import useUserQuery from "@/hooks/queries/useUserQuery";
import { toast } from "@/components/ui/sonner";

import { PatientResult } from "@/lib/types/patient";
import { LockInAssessment } from "@/lib/types/lockin";

export type { PatientResult } from "@/lib/types/patient";
export type { LockInAssessment } from "@/lib/types/lockin";

// ─── Fetcher ─────────────────────────────────────────────────────────────────

interface PatientResultData {
  patientResult: PatientResult | null;
  lockInAssessment: LockInAssessment | null;
}

async function fetchPatientResult(
  resultId: string,
): Promise<PatientResultData> {
  let patientResult: PatientResult | null = null;
  let lockInAssessment: LockInAssessment | null = null;

  // Try to open the result first (marks as seen)
  const openResponse = await api(ENDPOINTS.openPatientResult(resultId), {
    method: "POST",
  });

  let resultData: PatientResult | null = null;

  if (openResponse?.success && openResponse.data) {
    resultData = openResponse.data as PatientResult;
  } else {
    const resultResponse = await api(ENDPOINTS.getPatientResult(resultId));
    if (resultResponse?.success && resultResponse.data) {
      resultData = resultResponse.data as PatientResult;
    }
  }

  if (resultData) {
    patientResult = resultData;

    if (resultData.schoolId) {
      try {
        const lockInResponse = await api(
          ENDPOINTS.getSchoolLockIn(resultData.schoolId),
        );
        if (lockInResponse?.success && lockInResponse.data) {
          const lockInData = lockInResponse.data as {
            schoolName: string;
            students: Array<{
              studentName: string;
              lockinScore: number;
              lockedInInterpretation: string;
              lockedInColor: string;
            }>;
          };
          const student = lockInData.students?.find(
            (s) => s.studentName === resultData?.patientName,
          );
          if (student) {
            lockInAssessment = {
              fullName: resultData.patientName,
              age: resultData.patientAge,
              sex: resultData.patientSex,
              school: resultData.schoolName,
              lockedInScore: student.lockinScore.toFixed(2),
              lockedInScoreDescription: student.lockedInInterpretation,
              lockedInColor: student.lockedInColor,
              generalMentalHealth: "N/A",
              generalMentalHealthScore: "N/A",
              generalMentalHealthColor: "gray",
              possibleDepressionScore: "N/A",
              possibleDepressionDescription: "N/A",
              possibleDepressionColor: "gray",
              lonelinessScore: "N/A",
              lonelinessScoreDescription: "N/A",
              lonelinessColor: "gray",
              suicidalRiskScore: "N/A",
              suicidalRiskScoreDescription: "N/A",
              suicidalRiskColor: "gray",
              examAnxiety: "N/A",
              examAnxietyScore: "N/A",
              examAnxietyColor: "gray",
              coreAnxietyScore: "N/A",
              coreAnxietyScoreDescription: "N/A",
              coreAnxietyColor: "gray",
              physicalDistressScore: "N/A",
              physicalDistressScoreDescription: "N/A",
              physicalDistressColor: "gray",
              examPrep: "N/A",
              examPrepScore: "N/A",
              examPrepColor: "gray",
              motivationScore: "N/A",
              motivationScoreDescription: "N/A",
              motivationColor: "gray",
              studySkillsScore: "N/A",
              studySkillsScoreDescription: "N/A",
              studySkillsColor: "gray",
              procrastinationScore: "N/A",
              procrastinationScoreDescription: "N/A",
              procrastinationColor: "gray",
            };
          }
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        if (!errorMessage.includes("No lockins found")) {
          // Only log unexpected errors
        }
      }
    }
  }

  return { patientResult, lockInAssessment };
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function usePatientResult() {
  const params = useParams();
  const router = useRouter();
  const resultId = params.resultId as string;
  const { getProfileQuery } = useUserQuery();
  const queryClient = useQueryClient();

  const [isUpdating, setIsUpdating] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["patient-result", resultId],
    queryFn: () => fetchPatientResult(resultId),
    enabled: !!resultId && !!getProfileQuery.data,
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000,
  });

  const patientResult = data?.patientResult ?? null;
  const lockInAssessment = data?.lockInAssessment ?? null;

  const handleUpdateActionStatus = useCallback(
    async (actionStatus: "TREATING") => {
      if (!patientResult || !getProfileQuery.data) return;

      setIsUpdating(true);
      try {
        const providerId =
          getProfileQuery.data.id || getProfileQuery.data.email;
        const response = await api(ENDPOINTS.updateActionStatus(resultId), {
          method: "PUT",
          body: JSON.stringify({
            providerId,
            actionStatus,
          }),
        });

        if (response?.success) {
          toast.success("Action status updated successfully");
          // Refetch via React Query
          await queryClient.invalidateQueries({
            queryKey: ["patient-result", resultId],
          });
        } else {
          toast.error("Failed to update action status");
        }
      } catch (error) {
        console.error("Failed to update action status:", error);
        toast.error("Failed to update action status");
      } finally {
        setIsUpdating(false);
      }
    },
    [patientResult, getProfileQuery.data, resultId, queryClient],
  );

  const getColorClass = useCallback((color: string) => {
    switch (color) {
      case "red":
        return "bg-red-100 text-red-800";
      case "yellow":
        return "bg-yellow-100 text-yellow-800";
      case "green":
        return "bg-green-100 text-green-800";
      case "purple":
        return "bg-teal-100 text-teal-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }, []);

  const isTreating =
    patientResult?.treatingProviders.some(
      (p) =>
        p.id === getProfileQuery.data?.id ||
        p.id === getProfileQuery.data?.email,
    ) ?? false;

  return {
    router,
    patientResult,
    lockInAssessment,
    isLoading,
    isUpdating,
    isTreating,
    handleUpdateActionStatus,
    getColorClass,
  };
}
