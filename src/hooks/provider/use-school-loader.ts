"use client";

import { useSchoolDataLoader } from "./use-school-data-loader";
import { useSchoolLifecycle } from "./use-school-lifecycle";
import { School } from "@/lib/types/school";
import { SchoolWithExtras as SchoolWithExtrasAtom } from "@/atoms/provider-schools";

export function useSchoolLoader(
  getProfileQuery: any,
  updateSchoolInState: (id: number | string, data: Partial<SchoolWithExtrasAtom>) => void,
  setSchoolsState: any,
  schoolsState: any,
  fetchSchoolData: (school: School, isBackground?: boolean) => Promise<SchoolWithExtrasAtom>,
) {
  const {
    loadSchoolsWithData,
    previousSchoolsRef,
    isInitialLoadRef,
    abortControllerRef,
  } = useSchoolDataLoader(
    getProfileQuery,
    updateSchoolInState,
    setSchoolsState,
    schoolsState,
    fetchSchoolData,
  );

  useSchoolLifecycle(
    getProfileQuery,
    loadSchoolsWithData,
    previousSchoolsRef,
    isInitialLoadRef,
    abortControllerRef,
  );

  return { loadSchoolsWithData };
}
