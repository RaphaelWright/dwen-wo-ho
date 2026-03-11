"use client";

import { useState, useMemo, useEffect } from "react";
import useSchoolsQuery from "@/hooks/queries/use-schools";
import { useAtom } from "jotai";
import { curatorSchoolsAtom, SchoolWithExtras } from "@/atoms/curator-schools";
import { FilterType } from "@/lib/types/curator";
import { parseCampuses } from "@/lib/utils/parseCampuses";
import { useCuratorSchoolSearch } from "./use-curator-school-search";

export function getFirstCampus(campuses: any): string {
  const parsed = parseCampuses(campuses);
  return parsed.length > 0 ? parsed[0] : "";
}

export function useCuratorSchools() {
  const [schoolsState, setSchoolsState] = useAtom(curatorSchoolsAtom);
  const { schools: cachedSchools, isLoading: atomLoading } = schoolsState;

  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { useSchoolsWithRefetch } = useSchoolsQuery();
  const {
    data: allSchools = [],
    isLoading: schoolsLoading,
    isError,
  } = useSchoolsWithRefetch();

  // Use cached schools when available
  const mergedSchools = useMemo(() => {
    if (allSchools.length === 0) return [];
    if (cachedSchools.length > 0) {
      return cachedSchools;
    }
    return allSchools as SchoolWithExtras[];
  }, [allSchools, cachedSchools]);

  const filterCounts = useMemo(
    () => ({
      all: mergedSchools.length,
      JHS: mergedSchools.filter((s) => s.type === "JHS").length,
      SHS: mergedSchools.filter((s) => s.type === "SHS").length,
      COLLEGE: mergedSchools.filter((s) => s.type === "COLLEGE").length,
    }),
    [mergedSchools],
  );

  const { suggestions, quickFilters } = useCuratorSchoolSearch({
    searchQuery,
    activeTab: "icons", // Default to icons/schools for this view
    patients: [],
    schoolIcons: allSchools.map((s) => ({
      ...s,
      slogan: (s as any).nickname || "",
    })) as any,
    providers: [],
  });

  // Sync schools from React Query into the Jotai atom
  useEffect(() => {
    if (allSchools.length === 0) return;

    setSchoolsState((prev) => ({
      ...prev,
      isLoading: false,
      schools: allSchools.map((s) => ({ ...s }) as SchoolWithExtras),
    }));
  }, [allSchools, setSchoolsState]);

  const schoolsList = useMemo(() => {
    let filtered =
      activeFilter === "all"
        ? mergedSchools
        : mergedSchools.filter((school) => school.type === activeFilter);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((school) => {
        const nameMatch = school.name?.toLowerCase().includes(query);
        const nicknameMatch = school.nickname?.toLowerCase().includes(query);
        const typeMatch = school.type?.toLowerCase().includes(query);
        const campusesMatch = school.campuses?.some((campus) =>
          String(campus).toLowerCase().includes(query),
        );
        return nameMatch || nicknameMatch || typeMatch || campusesMatch;
      });
    }

    return filtered;
  }, [mergedSchools, activeFilter, searchQuery]);

  return {
    schoolsList,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    filterCounts,
    isLoading: schoolsLoading || atomLoading,
    hasCachedData: cachedSchools.length > 0,
    isError,
    suggestions,
    quickFilters,
  };
}
