"use client";

import { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { patientsService } from "@/services/patients";
import { lockinsService } from "@/services/lockins";
import useUserQuery from "@/hooks/queries/useUserProfile";
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

  let resultData: PatientResult | null = null;

  try {
    const openedResult = await patientsService.openPatientResult(resultId);
    if (openedResult) {
      resultData = openedResult;
    }
  } catch {
    const fetchedResult = await patientsService.getPatientResult(resultId);
    if (fetchedResult) {
      resultData = fetchedResult;
    }
  }

  if (resultData) {
    patientResult = resultData;

    if (resultData.schoolId) {
      try {
        const lockInData = await lockinsService.getSchoolLockIn(resultData.schoolId);
        if (lockInData) {
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
        const providerId = getProfileQuery.data.id || getProfileQuery.data.email;
        const response = await patientsService.updateActionStatus(resultId, {
          providerId,
          actionStatus,
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
