import type { SchoolType } from "@/lib/types/components/patient/onboarding";
import type { School } from "@/lib/types/entities/school";

export function filterSchoolsByType(
  schools: School[],
  schoolType: SchoolType,
): School[] {
  if (!schoolType) {
    return schools;
  }

  return schools.filter((school) => {
    const type = school.type?.toLowerCase() ?? "";

    if (schoolType === "high-school") {
      return type.includes("high") || type.includes("shs");
    }

    return type.includes("college") || type.includes("university");
  });
}
