"use client";

import { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { PatientCase } from "@/lib/types/api/patient-results";
import type { FilterOption } from "@/components/shared/search-dropdown";

interface UseProviderSearchConfigProps {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  appliedSearchQuery: string;
  setAppliedSearchQuery: (v: string) => void;
  localActiveFilters: FilterOption[];
  toggleFilter: (filter: FilterOption) => void;
  removeFilter: (filter: FilterOption) => void;
  clearFilters: () => void;
  filteredPatients: PatientCase[];
}

export function useProviderSearchConfig({
  searchQuery,
  setSearchQuery,
  appliedSearchQuery,
  setAppliedSearchQuery,
  localActiveFilters,
  toggleFilter,
  removeFilter,
  clearFilters,
  filteredPatients,
}: UseProviderSearchConfigProps) {
  const router = useRouter();

  // Compute suggestions with active filters applied
  const topSuggestions = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    // Check if score sorting filters are active
    const hasHighScoreFilter = localActiveFilters.some(f => f.id === "high-score");
    const hasLowScoreFilter = localActiveFilters.some(f => f.id === "low-score");

    // Helper to check if an item matches all active filters (excluding score sorts)
    const matchesAllFilters = (item: any) => {
      return localActiveFilters.every((filter) => {
        // Skip score sorting filters - they only sort, don't filter
        if (filter.id === "high-score" || filter.id === "low-score") return true;
        // For status filter
        if (filter.filterKey === "status" && filter.filterType === "exact") {
          return item[filter.filterKey] === filter.filterValue;
        }
        return true;
      });
    };

    let filtered = filteredPatients.filter((p) => matchesAllFilters(p));

    if (query) {
      filtered = filtered.filter((p) => {
        const nameMatch = p.patientName?.toLowerCase().includes(query);
        const schoolMatch = p.schoolName?.toLowerCase().includes(query);
        return nameMatch || schoolMatch;
      });
    }

    // Sort by score if High/Low Score filter is active
    if (hasHighScoreFilter) {
      filtered = [...filtered].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
    } else if (hasLowScoreFilter) {
      filtered = [...filtered].sort((a, b) => (a.score ?? 0) - (b.score ?? 0));
    }

    return filtered.slice(0, query ? 5 : 4);
  }, [searchQuery, filteredPatients, localActiveFilters]);

  const onSelectOption = useCallback((val: string) => {
    setSearchQuery(val);
  }, [setSearchQuery]);

  const onFilterChange = useCallback((filter: FilterOption) => {
    if (filter.filterKey) {
      toggleFilter(filter);
    }
  }, [toggleFilter]);

  const onSubmitSearch = useCallback((query: string) => {
    setAppliedSearchQuery(query);
  }, [setAppliedSearchQuery]);

  const onSuggestionAction = useCallback((p: PatientCase) => {
    router.push(`/provider/patients/${p.patientId}`);
  }, [router]);

  const onResetSearch = useCallback(() => {
    setSearchQuery("");
    setAppliedSearchQuery("");
    clearFilters();
  }, [setSearchQuery, setAppliedSearchQuery, clearFilters]);

  const getSuggestionValue = useCallback((p: PatientCase) => p.patientName, []);

  return {
    searchQuery,
    setSearchQuery,
    topSuggestions,
    localActiveFilters,
    onSelectOption,
    onFilterChange,
    removeFilter,
    onSubmitSearch,
    onSuggestionAction,
    onResetSearch,
    getSuggestionValue,
  };
}
