import { PatientResult } from "@/types/patient";
import { LockInAssessment } from "@/types/lockin";

export const getPatientInfoDetails = (patientResult: PatientResult) => [
  { label: "Name", value: patientResult.patientName },
  { label: "Age", value: patientResult.patientAge },
  { label: "Sex", value: patientResult.patientSex },
  { label: "School", value: patientResult.schoolName },
  {
    label: "Submitted",
    value: new Date(patientResult.createdAt).toLocaleDateString(),
  },
  ...(patientResult.firstOpenedAt
    ? [
        {
          label: "First Opened",
          value: new Date(patientResult.firstOpenedAt).toLocaleDateString(),
        },
      ]
    : []),
];

export const getLockInAssessmentMetrics = (
  lockInAssessment: LockInAssessment,
) => [
  {
    label: "General Mental Health",
    value: lockInAssessment.generalMentalHealth,
    score: lockInAssessment.generalMentalHealthScore,
    color: lockInAssessment.generalMentalHealthColor,
  },
  {
    label: "Depression Risk",
    value: lockInAssessment.possibleDepressionDescription,
    score: lockInAssessment.possibleDepressionScore,
    color: lockInAssessment.possibleDepressionColor,
  },
  {
    label: "Suicidal Risk",
    value: lockInAssessment.suicidalRiskScoreDescription,
    score: lockInAssessment.suicidalRiskScore,
    color: lockInAssessment.suicidalRiskColor,
  },
  {
    label: "Exam Anxiety",
    value: lockInAssessment.examAnxiety,
    score: lockInAssessment.examAnxietyScore,
    color: lockInAssessment.examAnxietyColor,
  },
  {
    label: "Exam Preparation",
    value: lockInAssessment.examPrep,
    score: lockInAssessment.examPrepScore,
    color: lockInAssessment.examPrepColor,
  },
];

export type ProviderDisplayData = {
  id?: string;
  name: string;
  subtext?: string;
  professionalTitle?: string;
};

export type ProviderSectionData = {
  key: string;
  title: string;
  providers: ProviderDisplayData[];
};

export const getProviderSections = (
  patientResult: PatientResult,
): ProviderSectionData[] => {
  const sections: ProviderSectionData[] = [];

  if (patientResult.starProvider) {
    sections.push({
      key: "star",
      title: "Star Provider",
      providers: [
        {
          id: patientResult.starProvider.id,
          name: patientResult.starProvider.fullName,
          professionalTitle: patientResult.starProvider.professionalTitle,
          subtext: patientResult.starProvider.specialty,
        },
      ],
    });
  }

  if (patientResult.referredProvider) {
    sections.push({
      key: "referred",
      title: "Referred Provider",
      providers: [
        {
          id: patientResult.referredProvider.id,
          name: patientResult.referredProvider.fullName,
        },
      ],
    });
  }

  if (patientResult.treatingProviders.length > 0) {
    sections.push({
      key: "treating",
      title: "Treating Providers",
      providers: patientResult.treatingProviders.map((p) => ({
        id: p.id,
        name: p.fullName,
      })),
    });
  }

  return sections;
};
