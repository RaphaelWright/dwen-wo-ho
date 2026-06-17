import type { SchoolTypeAverages } from "@/lib/types/api/lockin";
import type { LockInAssessment } from "@/lib/types/entities/lockin";

export interface ComparisonMetricDefinition {
  label: string;
  getScore: (assessment: LockInAssessment) => string;
  getAverage: (averages: SchoolTypeAverages) => number;
}

export const PATIENT_COMPARISON_METRICS: ComparisonMetricDefinition[] = [
  {
    label: "Locked In Score",
    getScore: (a) => a.lockedInScore,
    getAverage: (avg) => avg.averageLockedInScore,
  },
  {
    label: "Mental Health",
    getScore: (a) => a.generalMentalHealthScore,
    getAverage: (avg) => avg.averageGeneralMentalHealthScore,
  },
  {
    label: "Depression",
    getScore: (a) => a.possibleDepressionScore,
    getAverage: (avg) => avg.averageDepressionScore,
  },
  {
    label: "Loneliness",
    getScore: (a) => a.lonelinessScore,
    getAverage: (avg) => avg.averageLonelinessScore,
  },
  {
    label: "Suicidality",
    getScore: (a) => a.suicidalRiskScore,
    getAverage: (avg) => avg.averageSuicidalityScore,
  },
  {
    label: "Exam Anxiety",
    getScore: (a) => a.examAnxietyScore,
    getAverage: (avg) => avg.averageExamAnxietyScore,
  },
  {
    label: "Core Anxiety",
    getScore: (a) => a.coreAnxietyScore,
    getAverage: (avg) => avg.averageCoreAnxietyScore,
  },
  {
    label: "Physical Distress",
    getScore: (a) => a.physicalDistressScore,
    getAverage: (avg) => avg.averagePhysicalDistressScore,
  },
  {
    label: "Exam Preparation",
    getScore: (a) => a.examPrepScore,
    getAverage: (avg) => avg.averageExamPreparationScore,
  },
  {
    label: "Motivation",
    getScore: (a) => a.motivationScore,
    getAverage: (avg) => avg.averageMotivationScore,
  },
  {
    label: "Study Skills",
    getScore: (a) => a.studySkillsScore,
    getAverage: (avg) => avg.averageStudySkillsScore,
  },
  {
    label: "Procrastination",
    getScore: (a) => a.procrastinationScore,
    getAverage: (avg) => avg.averageProcrastinationScore,
  },
];
