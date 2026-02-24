"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ENDPOINTS } from "@/lib/constants/endpoints";
import { CuratorPatientResult } from "@/lib/types/curator";
import { LockInAssessment } from "@/lib/types/lockin";

export function generateColor(color: string) {
  let code = "";
  if (color === "yellow") code = "#ff9900";
  if (color === "green") code = "#081c05";
  if (color === "purple") code = "#0d9488";
  if (color === "red") code = "#ff0000";
  if (color === "light green") code = "#66ff66";
  if (color === "black") code = "#000000";
  return code;
}

export function useCuratorPatientDetails() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.patientId as string;

  const [patientResult, setPatientResult] =
    useState<CuratorPatientResult | null>(null);
  const [lockInAssessment, setLockInAssessment] =
    useState<LockInAssessment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"assessment" | "history">(
    "assessment",
  );

  const loadPatientDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const resultResponse = await api(
        ENDPOINTS.getPatientResult(Number(patientId)),
      );

      if (resultResponse?.success && resultResponse.data) {
        const resultData = resultResponse.data as CuratorPatientResult;
        setPatientResult(resultData);

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
              (s) => s.studentName === resultData.patientName,
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
          console.error("Error fetching lock-in data:", error);
        }
      }
    } catch (error) {
      console.error("Error loading patient details:", error);
    } finally {
      setIsLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    loadPatientDetails();
  }, [loadPatientDetails]);

  const metrics = useMemo(() => {
    if (!lockInAssessment) return [];
    return [
      {
        name: "General Mental Health",
        description: lockInAssessment.generalMentalHealth,
        score: lockInAssessment.generalMentalHealthScore,
        items: [
          {
            name: "Depression",
            description: lockInAssessment.possibleDepressionDescription,
            value: lockInAssessment.possibleDepressionScore,
            color: generateColor(lockInAssessment.possibleDepressionColor),
          },
          {
            name: "Loneliness",
            description: lockInAssessment.lonelinessScoreDescription,
            value: lockInAssessment.lonelinessScore,
            color: generateColor(lockInAssessment.lonelinessColor),
          },
          {
            name: "Suicidal Risk",
            description: lockInAssessment.suicidalRiskScoreDescription,
            value: lockInAssessment.suicidalRiskScore,
            color: generateColor(lockInAssessment.suicidalRiskColor),
          },
        ],
      },
      {
        name: "Exam Anxiety",
        score: lockInAssessment.examAnxietyScore,
        description: lockInAssessment.examAnxiety,
        items: [
          {
            name: "Physical Distress",
            description: lockInAssessment.physicalDistressScoreDescription,
            value: lockInAssessment.physicalDistressScore,
            color: generateColor(lockInAssessment.physicalDistressColor),
          },
          {
            name: "Core Anxiety",
            description: lockInAssessment.coreAnxietyScoreDescription,
            value: lockInAssessment.coreAnxietyScore,
            color: generateColor(lockInAssessment.coreAnxietyColor),
          },
        ],
      },
      {
        name: "Exam Prep",
        score: lockInAssessment.examPrepScore,
        description: lockInAssessment.examPrep,
        items: [
          {
            name: "Motivation",
            description: lockInAssessment.motivationScoreDescription,
            value: lockInAssessment.motivationScore,
            color: generateColor(lockInAssessment.motivationColor),
          },
          {
            name: "Procrastination",
            description: lockInAssessment.procrastinationScoreDescription,
            value: lockInAssessment.procrastinationScore,
            color: generateColor(lockInAssessment.procrastinationColor),
          },
          {
            name: "Study Skills",
            description: lockInAssessment.studySkillsScoreDescription,
            value: lockInAssessment.studySkillsScore,
            color: generateColor(lockInAssessment.studySkillsColor),
          },
        ],
      },
    ];
  }, [lockInAssessment]);

  return {
    router,
    patientResult,
    lockInAssessment,
    isLoading,
    activeTab,
    setActiveTab,
    metrics,
    generateColor,
  };
}
