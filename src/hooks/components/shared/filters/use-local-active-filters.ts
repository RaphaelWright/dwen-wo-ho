"use client";

import { useCallback, useState } from "react";
import type { FilterOption } from "@/lib/types/components/shared/search-dropdown";

export function useLocalActiveFilters() {
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

  return {
    localActiveFilters,
    toggleFilter,
    clearFilters,
    removeFilter,
  };
}
