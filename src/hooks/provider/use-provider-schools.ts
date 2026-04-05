"use client";

import { useRef } from "react";
import useUserQuery from "@/hooks/queries/use-user-profile";
import { useSchoolsState } from "./use-schools-state";
import { useSchoolDataFetcher } from "./use-school-data-fetcher";
import { useSchoolLoader } from "./use-school-loader";
import { useSchoolFilters } from "./use-school-filters";
import { SchoolWithExtras } from "@/atoms/provider-schools";
import { REFETCH_INTERVAL } from "@/lib/constants/provider-schools";

export function useProviderSchools() {
  const { getProfileQuery } = useUserQuery({
    refetchInterval: REFETCH_INTERVAL,
  });

  const { cachedSchools, atomLoading, updateSchoolInState, setSchoolsState } =
    useSchoolsState();

  const previousSchoolsRef = useRef<Map<number, SchoolWithExtras>>(new Map());

  const { fetchSchoolData } = useSchoolDataFetcher(
    updateSchoolInState,
    previousSchoolsRef,
  );

  const { loadSchoolsWithData } = useSchoolLoader(
    getProfileQuery,
    updateSchoolInState,
    setSchoolsState,
    { schools: cachedSchools },
    fetchSchoolData,
  );

  const {
    schoolsList,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
  } = useSchoolFilters(cachedSchools);

  return {
    schoolsList,
    cachedSchools,
    atomLoading,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    isLoadingProfile: getProfileQuery.isLoading,
  };
}
