"use client";

import { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { PatientCase } from "@/lib/types/api/patient-results";
import type { FilterOption } from "@/lib/types/components/shared/search-dropdown";
import { buildProviderTopSuggestions } from "@/lib/utils/provider/patient-filters";

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
  setAppliedSearchQuery,
  localActiveFilters,
  toggleFilter,
  removeFilter,
  clearFilters,
  filteredPatients,
}: UseProviderSearchConfigProps) {
  const router = useRouter();

  const topSuggestions = useMemo(
    () =>
      buildProviderTopSuggestions(
        filteredPatients,
        searchQuery,
        localActiveFilters,
      ),
    [filteredPatients, searchQuery, localActiveFilters],
  );

  const onSelectOption = useCallback(
    (val: string) => {
      setSearchQuery(val);
    },
    [setSearchQuery],
  );

  const onFilterChange = useCallback(
    (filter: FilterOption) => {
      if (filter.filterKey) {
        toggleFilter(filter);
      }
    },
    [toggleFilter],
  );

  const onSubmitSearch = useCallback(
    (query: string) => {
      setAppliedSearchQuery(query);
    },
    [setAppliedSearchQuery],
  );

  const onSuggestionAction = useCallback(
    (p: PatientCase) => {
      router.push(`/provider/patients/${p.patientId}`);
    },
    [router],
  );

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
