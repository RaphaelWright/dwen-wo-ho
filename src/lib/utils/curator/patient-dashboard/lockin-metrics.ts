import type { LockInAssessment } from "@/lib/types/entities/lockin";
import type { PatientMetricCategory } from "@/lib/types/components/curator/patient-dashboard";
import { getColorHex } from "@/lib/utils/shared/color-hex";

export function buildPatientLockinMetrics(
  lockInAssessment: LockInAssessment | null,
): PatientMetricCategory[] {
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
}
