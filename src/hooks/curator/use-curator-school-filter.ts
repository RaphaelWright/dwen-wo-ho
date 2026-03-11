"use client";

import { useMemo } from "react";
import { SchoolWithExtras } from "@/atoms/curator-schools";
import { SCHOOLS_LIST_SEARCH_QUICK_FILTERS } from "@/lib/constants/components/curator/schools-list-search";
import { getFirstCampus } from "./use-curator-schools";

interface UseCuratorSchoolsSearchProps {
  searchQuery: string;
  schools: SchoolWithExtras[];
  filterCounts: Record<string, number>;
}

export function useCuratorSchoolsSearch({
  searchQuery,
  schools,
  filterCounts,
}: UseCuratorSchoolsSearchProps) {
  const suggestions = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    const baseList = query
      ? schools.filter((school) => {
          const nameMatch = school.name?.toLowerCase().includes(query);
          const nicknameMatch = school.nickname?.toLowerCase().includes(query);
          const typeMatch = school.type?.toLowerCase().includes(query);
          return nameMatch || nicknameMatch || typeMatch;
        })
      : schools;

    return baseList
      .map((school) => ({
        name: school.name,
        score: 0,
        status: "ignored",
        time: school.type || "",
        preview: getFirstCampus(school.campuses),
      }))
      .slice(0, 5);
  }, [searchQuery, schools]);

  const quickFilters = useMemo(() => {
    return SCHOOLS_LIST_SEARCH_QUICK_FILTERS.map((filter) => ({
      ...filter,
      label: `${filter.label}${filterCounts[filter.id] !== undefined ? ` (${filterCounts[filter.id]})` : ""}`,
    }));
  }, [filterCounts]);

  return {
    suggestions,
    quickFilters,
  };
}
