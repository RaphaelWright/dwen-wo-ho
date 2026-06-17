"use client";

import { useSchoolDataLoader } from "./use-data-loader";
import { useSchoolLifecycle } from "./use-lifecycle";
import { School } from "@/lib/types/entities/school";
import { SchoolWithExtras as SchoolWithExtrasAtom } from "@/atoms/provider-schools";
import type { ProfileQueryHandle } from "@/lib/types/api/auth";

type ProviderSchoolsState = {
  schools: SchoolWithExtrasAtom[];
  lastUpdated: number | null;
  isLoading: boolean;
};

export function useSchoolLoader(
  getProfileQuery: ProfileQueryHandle,
  updateSchoolInState: (
    id: number | string,
    data: Partial<SchoolWithExtrasAtom>,
  ) => void,
  setSchoolsState: (
    update: (prev: ProviderSchoolsState) => ProviderSchoolsState,
  ) => void,
  schoolsState: ProviderSchoolsState,
  fetchSchoolData: (
    school: School,
    isBackground?: boolean,
  ) => Promise<SchoolWithExtrasAtom>,
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
