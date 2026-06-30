export function computeGraduationYear(
  yearsRemaining: number,
  referenceYear = new Date().getFullYear(),
): number {
  return referenceYear + yearsRemaining;
}

export function formatClassOf(graduationYear: number): string {
  return `Class of ${graduationYear}`;
}

export function formatStudentClassSummary(params: {
  gradeShort: string;
  yearsRemaining: number;
  programme: string;
  schoolName: string;
  referenceYear?: number;
}): string | null {
  if (!params.gradeShort.trim()) {
    return null;
  }

  const graduationYear = computeGraduationYear(
    params.yearsRemaining,
    params.referenceYear,
  );

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
  yearsRemaining: number,
  referenceYear = new Date().getFullYear(),
): string {
  return formatClassOf(computeGraduationYear(yearsRemaining, referenceYear));
}
