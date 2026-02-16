"use client";

import { useState, useEffect, useMemo } from "react";
import { api } from "@/lib/api";
import { ENDPOINTS } from "@/lib/constants/endpoints";
import { PatientResult, LockInAssessment } from "@/lib/types/modals";

export const usePatientDetailsCurator = ({
  isOpen,
  patientId,
}: {
  isOpen: boolean;
  patientId: string;
}) => {
  const [patientResult, setPatientResult] = useState<PatientResult | null>(
    null,
  );
  const [lockInAssessment, setLockInAssessment] =
    useState<LockInAssessment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const assessmentCategories = useMemo(() => {
    if (!lockInAssessment) return [];
    return [
      {
        label: "General Mental Health",
        score: lockInAssessment.generalMentalHealthScore,
        description: lockInAssessment.generalMentalHealth,
        color: lockInAssessment.generalMentalHealthColor,
      },
      {
        label: "Possible Depression",
        score: lockInAssessment.possibleDepressionScore,
        description: lockInAssessment.possibleDepressionDescription,
        color: lockInAssessment.possibleDepressionColor,
      },
      {
        label: "Loneliness",
        score: lockInAssessment.lonelinessScore,
        description: lockInAssessment.lonelinessScoreDescription,
        color: lockInAssessment.lonelinessColor,
      },
      {
        label: "Suicidal Risk",
        score: lockInAssessment.suicidalRiskScore,
        description: lockInAssessment.suicidalRiskScoreDescription,
        color: lockInAssessment.suicidalRiskColor,
      },
      {
        label: "Exam Anxiety",
        score: lockInAssessment.examAnxietyScore,
        description: lockInAssessment.examAnxiety,
        color: lockInAssessment.examAnxietyColor,
      },
      {
        label: "Core Anxiety",
        score: lockInAssessment.coreAnxietyScore,
        description: lockInAssessment.coreAnxietyScoreDescription,
        color: lockInAssessment.coreAnxietyColor,
      },
      {
        label: "Physical Distress",
        score: lockInAssessment.physicalDistressScore,
        description: lockInAssessment.physicalDistressScoreDescription,
        color: lockInAssessment.physicalDistressColor,
      },
      {
        label: "Exam Preparation",
        score: lockInAssessment.examPrepScore,
        description: lockInAssessment.examPrep,
        color: lockInAssessment.examPrepColor,
      },
      {
        label: "Motivation",
        score: lockInAssessment.motivationScore,
        description: lockInAssessment.motivationScoreDescription,
        color: lockInAssessment.motivationColor,
      },
      {
        label: "Study Skills",
        score: lockInAssessment.studySkillsScore,
        description: lockInAssessment.studySkillsScoreDescription,
        color: lockInAssessment.studySkillsColor,
      },
      {
        label: "Procrastination",
        score: lockInAssessment.procrastinationScore,
        description: lockInAssessment.procrastinationScoreDescription,
        color: lockInAssessment.procrastinationColor,
      },
    ];
  }, [lockInAssessment]);

  const providerGroups = useMemo(() => {
    if (!patientResult) return [];
    return [
      {
        id: "star",
        label: "Star Provider",
        data: patientResult.starProvider,
        icon: "⭐",
        colorClass: "bg-[#955aa4]",
        getContent: (p: any) => `${p.fullName} (${p.specialty})`,
      },
      {
        id: "referred",
        label: "Referred Provider",
        data: patientResult.referredProvider,
        icon: "→",
        colorClass: "bg-blue-500",
        getContent: (p: any) => p.fullName,
      },
    ];
  }, [patientResult]);

  const loadPatientDetails = async () => {
    setIsLoading(true);
    try {
      const resultResponse = await api(ENDPOINTS.getPatientResult(patientId));
      if (resultResponse?.success && resultResponse.data) {
        const resultData = resultResponse.data as PatientResult;
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
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          if (!errorMessage.includes("No lockins found")) {
            // Background error
          }
        }
      }
    } catch (error) {
      console.error("Error loading patient details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && patientId) {
      loadPatientDetails();
    } else {
      setPatientResult(null);
      setLockInAssessment(null);
      setIsLoading(true);
    }
  }, [isOpen, patientId]);

  return {
    patientResult,
    lockInAssessment,
    isLoading,
    loadPatientDetails,
    assessmentCategories,
    providerGroups,
  };
};
