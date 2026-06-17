"use client";

import { useRef } from "react";
import useUserQuery from "@/hooks/queries/use-user-profile";
import { useSchoolsState } from "./use-state";
import { useSchoolDataFetcher } from "../school/use-data-fetcher";
import { useSchoolLoader } from "../school/use-loader";
import { useSchoolFilters } from "../school/use-filters";
import { SchoolWithExtras } from "@/atoms/provider-schools";
import { REFETCH_INTERVAL } from "@/lib/constants/components/provider/schools/schools";

export function useProviderSchools() {
  const { getProfileQuery } = useUserQuery({
    refetchInterval: REFETCH_INTERVAL,
  });

  const {
    cachedSchools,
    atomLoading,
    schoolsState,
    updateSchoolInState,
    setSchoolsState,
  } = useSchoolsState();

  const previousSchoolsRef = useRef<Map<number, SchoolWithExtras>>(null!);
  if (!previousSchoolsRef.current) {
    previousSchoolsRef.current = new Map();
  }

  const { fetchSchoolData } = useSchoolDataFetcher(
    updateSchoolInState,
    previousSchoolsRef,
  );

  useSchoolLoader(
    getProfileQuery,
    updateSchoolInState,
    setSchoolsState,
    schoolsState,
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
