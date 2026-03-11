"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { patientsService } from "@/services/patients";

export const usePatientDetailsCurator = ({
  isOpen,
  patientId,
}: {
  isOpen: boolean;
  patientId: string;
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["curator-patient-modal", patientId],
    queryFn: () => patientsService.getFullPatientDetails(patientId),
    enabled: isOpen && !!patientId,
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000,
  });

  const patientResult = data?.patientResult ?? null;
  const lockInAssessment = data?.lockInAssessment ?? null;

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
        colorClass: "bg-primary",
        getContent: (p: any) => `${p.fullName} (${p.specialty})`,
      },
      {
        id: "referred",
        label: "Referred Provider",
        data: patientResult.referredProvider,
        icon: "→",
        colorClass: "bg-secondary",
        getContent: (p: any) => p.fullName,
      },
    ];
  }, [patientResult]);

  return {
    patientResult,
    lockInAssessment,
    isLoading,
    assessmentCategories,
    providerGroups,
  };
};
