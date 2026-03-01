"use client";

import { useState, useMemo, useEffect } from "react";
import { useSchoolsWithRefetch } from "@/hooks/queries/useSchoolsQuery";
import { useAtom } from "jotai";
import { curatorSchoolsAtom, SchoolWithExtras } from "@/atoms/curator-schools";

export type FilterType = "all" | "JHS" | "SHS" | "COLLEGE";

export const FILTER_OPTIONS: { label: string; value: FilterType }[] = [
  { label: "All", value: "all" },
  { label: "JHS", value: "JHS" },
  { label: "SHS", value: "SHS" },
  { label: "COLLEGE", value: "COLLEGE" },
];

import { parseCampuses } from "@/lib/utils/parseCampuses";

export function getFirstCampus(campuses: any): string {
  const parsed = parseCampuses(campuses);
  return parsed.length > 0 ? parsed[0] : "";
}

export function useCuratorSchools() {
  const [schoolsState, setSchoolsState] = useAtom(curatorSchoolsAtom);
  const { schools: cachedSchools, isLoading: atomLoading } = schoolsState;

  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const {
    data: allSchools = [],
    isLoading: schoolsLoading,
    isError,
  } = useSchoolsWithRefetch();

  // Sync schools from React Query into the Jotai atom
  useEffect(() => {
    if (allSchools.length === 0) return;

    setSchoolsState((prev) => ({
      ...prev,
      isLoading: false,
      schools: allSchools.map((s) => ({ ...s }) as SchoolWithExtras),
    }));
  }, [allSchools, setSchoolsState]);

  // Use cached schools when available
  const mergedSchools = useMemo(() => {
    if (allSchools.length === 0) return [];
    if (cachedSchools.length > 0) {
      return cachedSchools;
    }
    return allSchools as SchoolWithExtras[];
  }, [allSchools, cachedSchools]);

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
    isLoading: schoolsLoading || atomLoading,
    hasCachedData: cachedSchools.length > 0,
    isError,
  };
}
