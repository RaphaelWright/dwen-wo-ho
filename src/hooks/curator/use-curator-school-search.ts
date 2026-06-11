"use client";

import { useMemo, useState, useCallback } from "react";

import { formatProviderName } from "@/lib/utils/formatProviderName";

import { UseCuratorSchoolSearchProps, SchoolDetailSearchSuggestion } from "@/lib/types/curator";

import { SCHOOL_SEARCH_QUICK_FILTERS } from "@/lib/constants/components/curator/school-search";

import { compactTimeAgo } from "@/lib/utils/compactTimeAgo";
import type { FilterOption } from "@/components/shared/search-dropdown";

function matchesFilter(item: object, filter: FilterOption): boolean {
  const record = item as Record<string, unknown>;
  if (!filter.filterKey || !filter.filterValue) return true;

  const value = record[filter.filterKey];

  if (value === undefined || value === null) {
    // For "contains" checks on arrays, undefined/null means no match
    if (filter.filterType === "contains" && filter.filterValue === "hasItems") {
      return false;
    }
    return true;
  }

  const filterValue = filter.filterValue;

  switch (filter.filterType) {
    case "exact":
      return String(value).toLowerCase() === String(filterValue).toLowerCase();
    case "contains":
      if (filterValue === "hasItems" && Array.isArray(value)) {
        return value.length > 0;
      }
      return String(value).toLowerCase().includes(filterValue.toLowerCase());
    case "score":
      if (filterValue === "high") {
        return typeof value === "number" && value >= 5;
      }
      if (filterValue === "top3") {
        return typeof value === "number" && value <= 3;
      }
      return true;
    case "date":
      if (filterValue === "recent") {
        const createdDate = new Date(value as string | number | Date);
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return createdDate >= sevenDaysAgo;
      }
      return true;
    default:
      return true;
  }
}

export function useCuratorSchoolSearch({
  searchQuery,
  activeTab,
  patients,
  schoolIcons,
  providers,
}: UseCuratorSchoolSearchProps) {
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

  const suggestions = useMemo((): SchoolDetailSearchSuggestion[] => {
    const query = searchQuery.toLowerCase();

    // Helper to check if an item matches all active filters
    const matchesAllFilters = (item: object) => {
      return localActiveFilters.every((filter) => matchesFilter(item, filter));
    };

    const limit = query ? 5 : 4;
    const results: SchoolDetailSearchSuggestion[] = [];

    switch (activeTab) {
      case "patients":
        for (const p of patients) {
          if (!matchesAllFilters(p)) continue;
          if (query && !p.patientName?.toLowerCase().includes(query)) continue;
          results.push({
            id: p.id,
            name: p.patientName,
            score: p.lockinScore ?? 0,
            status:
              (p.treatingProviders?.length ?? 0) > 0
                ? "action"
                : p.visibilityStatus === "SEEN"
                  ? "follow-up"
                  : "new",
            time: compactTimeAgo(p.createdAt || ""),
            preview: p.comment || "",
          });
          if (results.length >= limit) break;
        }
        return results;

      case "icons":
        for (const i of schoolIcons) {
          if (!matchesAllFilters(i)) continue;
          if (query && !i.name.toLowerCase().includes(query)) continue;
          results.push({
            id: i.id,
            name: i.name,
            avatarUrl:
              i.logoUrl ||
              (typeof i.photo === "string" ? i.photo : undefined),
            type: i.type,
            slogan: i.slogan || "",
            rank: i.rank,
          });
          if (results.length >= limit) break;
        }
        return results;

      case "providers":
        for (const p of providers) {
          if (!matchesAllFilters(p)) continue;
          const providerName = formatProviderName(
            p.providerName,
            p.providerTitle,
          );
          if (query && !providerName.toLowerCase().includes(query)) continue;
          results.push({
            email: p.email,
            name: providerName,
            score: 0,
            status: p.applicationStatus === "APPROVED" ? "new" : "ignored",
            time: p.specialty || "",
            preview: p.applicationStatus || "",
          });
          if (results.length >= limit) break;
        }
        return results;

      default:
        return [];
    }
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
