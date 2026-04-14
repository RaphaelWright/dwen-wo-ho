"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { patientsService } from "@/services/patients";
import { getColorHex } from "@/lib/utils/color-utils";
import usePatientResultQuery from "@/hooks/queries/use-patient-result";
import { QUERY_KEYS } from "@/lib/constants/query-keys";
import { useDeleteSinglePatientRecord } from "@/hooks/curator/use-curator-delete-patient-records";

export function useCuratorPatientDetails() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.patientId as string;
  const schoolId = params.schoolId as string;

  const [activeTab, setActiveTab] = useState<"assessment" | "history">(
    "assessment",
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { deleteSinglePatient, singleDeletePending } =
    useDeleteSinglePatientRecord(schoolId);

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.curatorPatientDetails, patientId],
    queryFn: () => patientsService.getFullPatientDetails(patientId),
    enabled: !!patientId,
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const patientResult = data?.patientResult ?? null;
  const lockInAssessment = data?.lockInAssessment ?? null;

  const { usePatientActions, addPatientAction, isAddingAction } =
    usePatientResultQuery();
  const actionsQuery = usePatientActions(patientId, {
    enabled: !!patientId && !!data,
  });
  const actions = actionsQuery.data ?? [];

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
            color: getColorHex(lockInAssessment.possibleDepressionColor),
          },
          {
            name: "Loneliness",
            description: lockInAssessment.lonelinessScoreDescription,
            value: lockInAssessment.lonelinessScore,
            color: getColorHex(lockInAssessment.lonelinessColor),
          },
          {
            name: "Suicidal Risk",
            description: lockInAssessment.suicidalRiskScoreDescription,
            value: lockInAssessment.suicidalRiskScore,
            color: getColorHex(lockInAssessment.suicidalRiskColor),
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
            color: getColorHex(lockInAssessment.physicalDistressColor),
          },
          {
            name: "Core Anxiety",
            description: lockInAssessment.coreAnxietyScoreDescription,
            value: lockInAssessment.coreAnxietyScore,
            color: getColorHex(lockInAssessment.coreAnxietyColor),
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
            color: getColorHex(lockInAssessment.motivationColor),
          },
          {
            name: "Procrastination",
            description: lockInAssessment.procrastinationScoreDescription,
            value: lockInAssessment.procrastinationScore,
            color: getColorHex(lockInAssessment.procrastinationColor),
          },
          {
            name: "Study Skills",
            description: lockInAssessment.studySkillsScoreDescription,
            value: lockInAssessment.studySkillsScore,
            color: getColorHex(lockInAssessment.studySkillsColor),
          },
        ],
      },
    ];
  }, [lockInAssessment]);

  const handleDeleteConfirm = () => {
    deleteSinglePatient(patientId, {
      onSuccess: () => {
        setShowDeleteModal(false);
        router.back();
      },
    });
  };

  return {
    router,
    patientResult,
    lockInAssessment,
    isLoading,
    activeTab,
    setActiveTab,
    metrics,
    actions,
    isActionsLoading: actionsQuery.isLoading,
    addPatientAction,
    isAddingAction,
    showDeleteModal,
    setShowDeleteModal,
    singleDeletePending,
    handleDeleteConfirm,
  };
}
