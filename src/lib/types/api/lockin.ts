export interface AssessmentItem {
  itemName: string;
  category: string;
  score: number;
  maxScore: number;
  description: string;
  color: string;
}

export interface ScoreAverageDTO {
  schoolType: string;
  averageLockedInScore: number;
  averageGeneralMentalHealthScore: number;
  averageDepressionScore: number;
  averageLonelinessScore: number;
  averageSuicidalityScore: number;
  averageExamAnxietyScore: number;
  averageCoreAnxietyScore: number;
  averagePhysicalDistressScore: number;
  averageExamPreparationScore: number;
  averageMotivationScore: number;
  averageStudySkillsScore: number;
  averageProcrastinationScore: number;
  sampleSize: number;
}

export type SchoolTypeAverages = ScoreAverageDTO;

export interface LockinUpdateResponse {
  lockinId: number;
  patientName: string;
  patientAge: number;
  patientSex: string;
  schoolName: string;
  schoolType: string;
  comment?: string | null;
  lockinDate: string;
  lockedInScore: number;
  lockedInScoreDescription?: string;
  lockedInColor?: string;
  generalMentalHealthScore: number;
  generalMentalHealthDescription?: string;
  depressionScore: number;
  depressionDescription?: string;
  lonelinessScore: number;
  lonelinessDescription?: string;
  suicidalityScore: number;
  suicidalityDescription?: string;
  examAnxietyScore: number;
  examAnxietyDescription?: string;
  coreAnxietyScore: number;
  coreAnxietyDescription?: string;
  physicalDistressScore: number;
  physicalDistressDescription?: string;
  examPreparationScore: number;
  examPreparationDescription?: string;
  motivationScore: number;
  motivationDescription?: string;
  studySkillsScore: number;
  studySkillsDescription?: string;
  procrastinationScore: number;
  procrastinationDescription?: string;
  schoolTypeAverages: SchoolTypeAverages;
  assessmentItems: AssessmentItem[];
  inUrgentCare: boolean;
  urgentCareEnteredAt?: string;
  timeInUrgentCareMinutes?: number;
}
