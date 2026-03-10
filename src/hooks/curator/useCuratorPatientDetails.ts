"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { patientsService } from "@/services/patients";
import { lockinsService } from "@/services/lockins";
import { CuratorPatientResult } from "@/lib/types/curator";
import { LockInAssessment } from "@/lib/types/lockin";

export function generateColor(color: string) {
  let code = "";
  if (color === "yellow") code = "#ff9900";
  if (color === "orange") code = "#f97316";
  if (color === "green") code = "#081c05";
  if (color === "purple") code = "#0d9488";
  if (color === "red") code = "#ff0000";
  if (color === "light green") code = "#66ff66";
  if (color === "black") code = "#000000";
  return code;
}

interface PatientDetailsData {
  patientResult: CuratorPatientResult | null;
  lockInAssessment: LockInAssessment | null;
}

async function fetchPatientDetails(
  patientId: string,
): Promise<PatientDetailsData> {
  let patientResult: CuratorPatientResult | null = null;
  let lockInAssessment: LockInAssessment | null = null;

  const fetchedResult = await patientsService.getPatientResult(patientId);

  if (fetchedResult) {
    patientResult = fetchedResult as CuratorPatientResult;

    // Fetch per-patient lock-in assessment data using the lockinId
    try {
      const lockInUpdateData = await lockinsService.getLockInUpdate(patientResult.lockinId);

      if (lockInUpdateData) {
        const data = lockInUpdateData as Record<string, unknown>;

        // Extract colors from assessmentItems array
        const items =
          (data.assessmentItems as Array<{
            itemName: string;
            color: string;
          }>) ?? [];
        const colorMap: Record<string, string> = {};
        for (const item of items) {
          colorMap[item.itemName] = item.color;
        }

        lockInAssessment = {
          fullName: patientResult.patientName,
          age: patientResult.patientAge,
          sex: patientResult.patientSex,
          school: patientResult.schoolName,
          lockedInScore:
            typeof data.lockedInScore === "number"
              ? data.lockedInScore.toFixed(2)
              : String(data.lockedInScore ?? "N/A"),
          lockedInScoreDescription: String(
            data.lockedInScoreDescription ?? "N/A",
          ),
          lockedInColor: String(data.lockedInColor ?? "gray"),
          generalMentalHealth: String(
            data.generalMentalHealthDescription ?? "N/A",
          ),
          generalMentalHealthScore: String(
            data.generalMentalHealthScore ?? "N/A",
          ),
          generalMentalHealthColor: colorMap["Overall Mental Health"] ?? "gray",
          possibleDepressionScore: String(data.depressionScore ?? "N/A"),
          possibleDepressionDescription: String(
            data.depressionDescription ?? "N/A",
          ),
          possibleDepressionColor: colorMap["Possible Depression"] ?? "gray",
          lonelinessScore: String(data.lonelinessScore ?? "N/A"),
          lonelinessScoreDescription: String(
            data.lonelinessDescription ?? "N/A",
          ),
          lonelinessColor: colorMap["Loneliness"] ?? "gray",
          suicidalRiskScore: String(data.suicidalityScore ?? "N/A"),
          suicidalRiskScoreDescription: String(
            data.suicidalityDescription ?? "N/A",
          ),
          suicidalRiskColor: colorMap["Suicidal Risk"] ?? "gray",
          examAnxiety: String(data.examAnxietyDescription ?? "N/A"),
          examAnxietyScore: String(data.examAnxietyScore ?? "N/A"),
          examAnxietyColor: colorMap["Overall Exam Anxiety"] ?? "gray",
          coreAnxietyScore: String(data.coreAnxietyScore ?? "N/A"),
          coreAnxietyScoreDescription: String(
            data.coreAnxietyDescription ?? "N/A",
          ),
          coreAnxietyColor: colorMap["Core Anxiety"] ?? "gray",
          physicalDistressScore: String(data.physicalDistressScore ?? "N/A"),
          physicalDistressScoreDescription: String(
            data.physicalDistressDescription ?? "N/A",
          ),
          physicalDistressColor: colorMap["Physical Distress"] ?? "gray",
          examPrep: String(data.examPreparationDescription ?? "N/A"),
          examPrepScore: String(data.examPreparationScore ?? "N/A"),
          examPrepColor: colorMap["Overall Exam Preparation"] ?? "gray",
          motivationScore: String(data.motivationScore ?? "N/A"),
          motivationScoreDescription: String(
            data.motivationDescription ?? "N/A",
          ),
          motivationColor: colorMap["Motivation"] ?? "gray",
          studySkillsScore: String(data.studySkillsScore ?? "N/A"),
          studySkillsScoreDescription: String(
            data.studySkillsDescription ?? "N/A",
          ),
          studySkillsColor: colorMap["Study Skills"] ?? "gray",
          procrastinationScore: String(data.procrastinationScore ?? "N/A"),
          procrastinationScoreDescription: String(
            data.procrastinationDescription ?? "N/A",
          ),
          procrastinationColor: colorMap["Procrastination"] ?? "gray",
        };
      }
    } catch (error) {
      console.error("Error fetching lock-in update data:", error);
    }
  }

  return { patientResult, lockInAssessment };
}

export function useCuratorPatientDetails() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.patientId as string;

  const [activeTab, setActiveTab] = useState<"assessment" | "history">(
    "assessment",
  );

  const { data, isLoading } = useQuery({
    queryKey: ["curator-patient-details", patientId],
    queryFn: () => fetchPatientDetails(patientId),
    enabled: !!patientId,
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const patientResult = data?.patientResult ?? null;
  const lockInAssessment = data?.lockInAssessment ?? null;

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
