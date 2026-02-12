export interface LockInStudent {
  studentName: string;
  lockinScore: number;
  lockedInInterpretation: string;
  lockedInColor: string;
  // Additional fields found in usage
  lockinId?: number;
  createdAt?: string;
  patientResultId?: number;
  visibilityStatus?: "NEW" | "SEEN";
}

export interface LockInData {
  schoolName: string;
  students: LockInStudent[];
}

export interface LockInAssessment {
  fullName: string;
  age: number;
  sex: string;
  school: string;
  generalMentalHealth: string;
  generalMentalHealthScore: string;
  generalMentalHealthColor: string;
  possibleDepressionScore: string;
  possibleDepressionDescription: string;
  possibleDepressionColor: string;
  lonelinessScore: string;
  lonelinessScoreDescription: string;
  lonelinessColor: string;
  suicidalRiskScore: string;
  suicidalRiskScoreDescription: string;
  suicidalRiskColor: string;
  examAnxiety: string;
  examAnxietyScore: string;
  examAnxietyColor: string;
  coreAnxietyScore: string;
  coreAnxietyScoreDescription: string;
  coreAnxietyColor: string;
  physicalDistressScore: string;
  physicalDistressScoreDescription: string;
  physicalDistressColor: string;
  examPrep: string;
  examPrepScore: string;
  examPrepColor: string;
  motivationScore: string;
  motivationScoreDescription: string;
  motivationColor: string;
  studySkillsScore: string;
  studySkillsScoreDescription: string;
  studySkillsColor: string;
  procrastinationScore: string;
  procrastinationScoreDescription: string;
  procrastinationColor: string;
  lockedInScore: string;
  lockedInScoreDescription: string;
  lockedInColor: string;
}


