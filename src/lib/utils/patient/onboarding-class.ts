import type { SchoolType } from "@/lib/types/components/patient/onboarding";
import {
  ONBOARDING_COLLEGE_GRADES,
  ONBOARDING_HS_GRADES,
} from "@/lib/constants/components/patient/onboarding";

function getGradeOptionsForSchoolType(
  schoolType: SchoolType,
): readonly string[] {
  return schoolType === "high-school"
    ? ONBOARDING_HS_GRADES
    : ONBOARDING_COLLEGE_GRADES;
}

export function computeGraduationYear(
  gradeShort: string,
  schoolType: SchoolType,
  referenceYear = new Date().getFullYear(),
): number | null {
  if (!gradeShort.trim()) {
    return null;
  }

  const options = getGradeOptionsForSchoolType(schoolType);
  const gradeIndex = options.findIndex((grade) => grade === gradeShort);

  if (gradeIndex < 0) {
    return null;
  }

  const yearsUntilGraduation = options.length - gradeIndex - 1;
  return referenceYear + yearsUntilGraduation;
}

export function formatClassOf(graduationYear: number): string {
  return `Class of ${graduationYear}`;
}

export function formatStudentClassSummary(params: {
  gradeShort: string;
  schoolType: SchoolType;
  programme: string;
  schoolName: string;
  referenceYear?: number;
}): string | null {
  const graduationYear = computeGraduationYear(
    params.gradeShort,
    params.schoolType,
    params.referenceYear,
  );

  if (graduationYear === null) {
    return null;
  }

  const detailParts = [
    params.programme.trim(),
    params.schoolName.trim(),
  ].filter(Boolean);

  if (detailParts.length === 0) {
    return `You're ${formatClassOf(graduationYear)}`;
  }

  return `You're ${formatClassOf(graduationYear)}, ${detailParts.join(", ")}`;
}

export function getClassLabelForGrade(
  gradeShort: string,
  schoolType: SchoolType,
  referenceYear = new Date().getFullYear(),
): string | null {
  const graduationYear = computeGraduationYear(
    gradeShort,
    schoolType,
    referenceYear,
  );

  if (graduationYear === null) {
    return null;
  }

  return formatClassOf(graduationYear);
}
