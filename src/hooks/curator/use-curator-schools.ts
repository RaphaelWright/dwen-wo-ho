"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import useSchoolsQuery from "@/hooks/queries/use-schools";
import { useAtom } from "jotai";
import { curatorSchoolsAtom, SchoolWithExtras } from "@/atoms/curator-schools";
import { FilterType } from "@/lib/types/curator";
import { School } from "@/lib/types/school";
import { parseCampuses } from "@/lib/utils/parseCampuses";
import { SCHOOLS_LIST_SEARCH_QUICK_FILTERS } from "@/lib/constants/components/curator/schools-list-search";
import type { FilterOption } from "@/components/shared/search-dropdown";

function matchesFilter(item: object, filter: FilterOption): boolean {
  const record = item as Record<string, unknown>;
  if (!filter.filterKey || !filter.filterValue) return true;

  const value = record[filter.filterKey];

  if (value === undefined || value === null) return true;

  const filterValue = filter.filterValue;

  switch (filter.filterType) {
    case "exact":
      return String(value).toLowerCase() === String(filterValue).toLowerCase();
    case "contains":
      return String(value).toLowerCase().includes(filterValue.toLowerCase());
    default:
      return true;
  }
}

export function getFirstCampus(campuses: School["campuses"]): string {
  const parsed = parseCampuses(campuses);
  return parsed.length > 0 ? parsed[0] : "";
}

export function useCuratorSchools() {
  const [schoolsState, setSchoolsState] = useAtom(curatorSchoolsAtom);
  const { schools: cachedSchools, isLoading: atomLoading } = schoolsState;

  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearchQuery, setAppliedSearchQuery] = useState("");
  const [localActiveFilters, setLocalActiveFilters] = useState<FilterOption[]>(
    [],
  );

  const toggleFilter = useCallback((filter: FilterOption) => {
    setLocalActiveFilters((prev) => {
      const exists = prev.some((f) => f.id === filter.id);
      if (exists) {
        return prev.filter((f) => f.id !== filter.id);
      }
      return [...prev, filter];
    });
  }, []);

  const clearFilters = useCallback(() => {
    setLocalActiveFilters([]);
  }, []);

  const removeFilter = useCallback((filter: FilterOption) => {
    setLocalActiveFilters((prev) => prev.filter((f) => f.id !== filter.id));
  }, []);

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

  // Compute suggestions with active filters applied
  const suggestions = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    // Helper to check if an item matches all active filters
    const matchesAllFilters = (item: object) => {
      return localActiveFilters.every((filter) => matchesFilter(item, filter));
    };

    let filtered = allSchools.filter((school) => matchesAllFilters(school));

    if (query) {
      filtered = filtered.filter((school) => {
        const schoolWithExtras = school as SchoolWithExtras;
        const nameMatch = school.name?.toLowerCase().includes(query);
        const nicknameMatch = schoolWithExtras.nickname
          ?.toLowerCase()
          .includes(query);
        const typeMatch = school.type?.toLowerCase().includes(query);
        return nameMatch || nicknameMatch || typeMatch;
      });
    }

    return filtered
      .map((school) => {
        const schoolWithExtras = school as SchoolWithExtras;
        return {
          id: school.id,
          name: school.name,
          avatarUrl: schoolWithExtras.logo ?? school.logo,
          type: school.type,
          slogan: schoolWithExtras.nickname || school.motto || "",
        };
      })
      .slice(0, query ? 5 : 4);
  }, [searchQuery, allSchools, localActiveFilters]);

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

    if (appliedSearchQuery.trim()) {
      const query = appliedSearchQuery.toLowerCase().trim();
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
  }, [mergedSchools, activeFilter, appliedSearchQuery]);

  return {
    schoolsList,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    appliedSearchQuery,
    setAppliedSearchQuery,
    filterCounts,
    isLoading: schoolsLoading || atomLoading,
    hasCachedData: cachedSchools.length > 0,
    isError,
    suggestions,
    quickFilters: SCHOOLS_LIST_SEARCH_QUICK_FILTERS,
    localActiveFilters,
    toggleFilter,
    removeFilter,
    clearFilters,
  };
}
