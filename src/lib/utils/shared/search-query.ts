import type { SchoolSearchFields } from "@/lib/types/components/shared/search-query";

export type { SchoolSearchFields };

export function includesQuery(
  value: string | undefined | null,
  query: string,
): boolean {
  if (!query) return true;
  return value?.toLowerCase().includes(query) ?? false;
}

export function anyFieldIncludesQuery(
  fields: Array<string | undefined | null>,
  query: string,
): boolean {
  return fields.some((field) => includesQuery(field, query));
}

function schoolFieldMatches(
  school: SchoolSearchFields,
  query: string,
  includeCampuses: boolean,
): boolean[] {
  return [
    includesQuery(school.name, query),
    includesQuery(school.nickname, query),
    includesQuery(school.type, query),
    includeCampuses &&
      (school.campuses?.some((campus) =>
        includesQuery(String(campus), query),
      ) ??
        false),
  ];
}

export function schoolMatchesSearchQuery(
  school: SchoolSearchFields,
  rawQuery: string,
  options?: { includeCampuses?: boolean },
): boolean {
  const query = rawQuery.toLowerCase().trim();
  if (!query) return true;

  const includeCampuses = options?.includeCampuses ?? true;
  return schoolFieldMatches(school, query, includeCampuses).some(Boolean);
}

export function filterSchoolsBySearchQuery<T>(
  schools: T[],
  rawQuery: string,
  options?: { includeCampuses?: boolean },
): T[] {
  const query = rawQuery.trim();
  if (!query) return schools;

  return schools.filter((school) =>
    schoolMatchesSearchQuery(school as SchoolSearchFields, query, options),
  );
}
