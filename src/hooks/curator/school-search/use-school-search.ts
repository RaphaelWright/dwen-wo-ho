"use client";

import { useMemo } from "react";

import { UseCuratorSchoolSearchProps } from "@/lib/types/components/curator/school-search";

import { SCHOOL_SEARCH_QUICK_FILTERS } from "@/lib/constants/components/curator/school-details/search";

import { useLocalActiveFilters } from "@/hooks/components/shared/filters/use-local-active-filters";
import { buildCuratorSchoolTabSuggestions } from "@/lib/utils/curator/school-details/search-suggestions";

export function useCuratorSchoolSearch({
  searchQuery,
  activeTab,
  patients,
  schoolIcons,
  providers,
}: UseCuratorSchoolSearchProps) {
  const { localActiveFilters, toggleFilter, clearFilters, removeFilter } =
    useLocalActiveFilters();

  const suggestions = useMemo(() => {
    const query = searchQuery.toLowerCase();
    const limit = query ? 5 : 4;

    return buildCuratorSchoolTabSuggestions({
      activeTab,
      query,
      activeFilters: localActiveFilters,
      patients,
      schoolIcons,
      providers,
      limit,
    });
  }, [
    searchQuery,
    activeTab,
    patients,
    schoolIcons,
    providers,
    localActiveFilters,
  ]);

  const quickFilters = useMemo(() => {
    return SCHOOL_SEARCH_QUICK_FILTERS[activeTab] || [];
  }, [activeTab]);

  return {
    suggestions,
    quickFilters,
    localActiveFilters,
    toggleFilter,
    removeFilter,
    clearFilters,
  };
}
