import type { SchoolType } from "@/lib/types/components/patient/onboarding";
import {
  ONBOARDING_COLLEGE_GRADE_OPTIONS,
  ONBOARDING_HS_GRADE_OPTIONS,
} from "@/lib/constants/components/patient/onboarding";

export function getGradeOptionsForSchoolType(schoolType: SchoolType) {
  return schoolType === "high-school"
    ? ONBOARDING_HS_GRADE_OPTIONS
    : ONBOARDING_COLLEGE_GRADE_OPTIONS;
}

export function getFilteredGradeOptions(params: {
  schoolType: SchoolType;
  programmeDurationYears: number;
}) {
  const options = getGradeOptionsForSchoolType(params.schoolType);
  const duration = params.programmeDurationYears;

  if (!duration) {
    return [...options];
  }

  return options.filter((option) => option.yearNumber <= duration);
}
