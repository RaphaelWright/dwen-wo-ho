"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ENDPOINTS } from "@/lib/constants/endpoints";
import useUserQuery from "@/hooks/queries/useUserQuery";
import { toast } from "sonner";

import { PatientResult } from "@/lib/types/patient";
import { LockInAssessment } from "@/lib/types/lockin";

export type { PatientResult } from "@/lib/types/patient";
export type { LockInAssessment } from "@/lib/types/lockin";

export function usePatientResult() {
  const params = useParams();
  const router = useRouter();
  const resultId = params.resultId as string;
  const { getProfileQuery } = useUserQuery();

  const [patientResult, setPatientResult] = useState<PatientResult | null>(
    null,
  );
  const [lockInAssessment, setLockInAssessment] =
    useState<LockInAssessment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const loadPatientResult = useCallback(async () => {
    setIsLoading(true);
    try {
      const openResponse = await api(ENDPOINTS.openPatientResult(resultId), {
        method: "POST",
      });

      let resultData: PatientResult | null = null;

      if (openResponse?.success && openResponse.data) {
        resultData = openResponse.data as PatientResult;
        setPatientResult(resultData);
      } else {
        const resultResponse = await api(ENDPOINTS.getPatientResult(resultId));
        if (resultResponse?.success && resultResponse.data) {
          resultData = resultResponse.data as PatientResult;
          setPatientResult(resultData);
        }
      }

      if (resultData?.schoolId) {
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
              setLockInAssessment({
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
              });
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
    } catch (error) {
      console.error("Failed to load patient result:", error);
    } finally {
      setIsLoading(false);
    }
  }, [resultId]);

  useEffect(() => {
    if (resultId && getProfileQuery.data) {
      loadPatientResult();
    }
  }, [resultId, getProfileQuery.data, loadPatientResult]);

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
          await loadPatientResult();
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
    [patientResult, getProfileQuery.data, resultId, loadPatientResult],
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
        return "bg-purple-100 text-purple-800";
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
