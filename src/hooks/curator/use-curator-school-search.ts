"use client";

import { useMemo, useState, useCallback } from "react";

import { formatProviderName } from "@/lib/utils/formatProviderName";

import { UseCuratorSchoolSearchProps } from "@/lib/types/curator";

import { SCHOOL_SEARCH_QUICK_FILTERS } from "@/lib/constants/components/curator/school-search";

import { compactTimeAgo } from "@/lib/utils/compactTimeAgo";
import type { FilterOption } from "@/components/shared/search-dropdown";

function matchesFilter(item: any, filter: FilterOption): boolean {
  if (!filter.filterKey || !filter.filterValue) return true;

  const value = item[filter.filterKey];

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
        const createdDate = new Date(value);
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

  const suggestions = useMemo(() => {
    const query = searchQuery.toLowerCase();

    // Helper to check if an item matches all active filters
    const matchesAllFilters = (item: any) => {
      return localActiveFilters.every((filter) => matchesFilter(item, filter));
    };

    switch (activeTab) {
      case "patients":
        return patients
          .filter((p) => matchesAllFilters(p))
          .filter((p) => !query || p.patientName?.toLowerCase().includes(query))
          .map((p) => ({
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
          }))
          .slice(0, query ? 5 : 4);

      case "icons":
        return schoolIcons
          .filter((i) => matchesAllFilters(i))
          .filter((i) => !query || i.name.toLowerCase().includes(query))
          .map((i: any) => ({
            id: i.id,
            name: i.name,
            avatarUrl:
              i.logoUrl ||
              i.logo ||
              i.photoPreview ||
              (typeof i.photo === "string" ? i.photo : undefined),
            type: i.type,
            slogan: i.slogan || i.motto || "",
            rank: i.rank,
          }))
          .slice(0, query ? 5 : 4);

      case "providers":
        return providers
          .filter((p) => matchesAllFilters(p))
          .filter(
            (p) =>
              !query ||
              formatProviderName(p.providerName, p.providerTitle)
                .toLowerCase()
                .includes(query),
          )
          .map((p) => ({
            email: p.email,
            name: formatProviderName(p.providerName, p.providerTitle),
            score: 0,
            status: p.applicationStatus === "APPROVED" ? "new" : "ignored",
            time: p.specialty || "",
            preview: p.applicationStatus || "",
          }))
          .slice(0, query ? 5 : 4);

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
