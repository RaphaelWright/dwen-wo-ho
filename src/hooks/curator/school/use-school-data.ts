"use client";

import { useMemo } from "react";
import { School } from "@/lib/types/school";
import { SchoolPatientRecord } from "@/lib/types/components/curator/school-details";
import useSchoolsQuery from "@/hooks/queries/use-schools";
import useSchoolDetailsQuery from "@/hooks/queries/use-school-details";
import { parseCampuses } from "@/lib/utils/parseCampuses";

export function useSchoolData(schoolId: string) {
  const { useSchool, invalidateSchool, disableSchool } = useSchoolsQuery();
  
  const {
    patientsQuery,
    providersQuery,
    urgentCareQuery,
    invalidateSchoolProviders,
  } = useSchoolDetailsQuery(schoolId);

  const schoolQuery = useSchool(schoolId);

  const rawSchool = schoolQuery.data as (School & { campuses?: unknown }) | undefined;

  const school = useMemo(() => {
    if (!rawSchool) return null;
    const s = { ...rawSchool } as School;
    if (rawSchool.campuses) {
      s.campuses = parseCampuses(rawSchool.campuses as string[]);
    }
    return s;
  }, [rawSchool]);

  const patients = (patientsQuery.data as SchoolPatientRecord[]) ?? [];
  const providers = providersQuery.data ?? [];
  const urgentCare = urgentCareQuery.data ?? {
    totalUrgentCarePatients: 0,
    patients: [],
  };

  const isLoading = schoolQuery.isLoading;
  const error = schoolQuery.error
    ? (schoolQuery.error as Error).message ?? "Failed to load school details"
    : null;
    
  const campusLabel = school ? parseCampuses(school.campuses)[0] : null;

  return {
    school,
    patients,
    providers,
    urgentCare,
    isLoading,
    error,
    campusLabel,
    patientsLoading: patientsQuery.isLoading,
    providersLoading: providersQuery.isLoading,
    urgentLoading: urgentCareQuery.isLoading,
    invalidateSchool,
    disableSchool,
    invalidateSchoolProviders,
  };
}
