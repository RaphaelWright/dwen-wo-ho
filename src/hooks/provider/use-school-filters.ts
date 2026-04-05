"use client";

import { useState, useMemo } from "react";
import { SchoolWithExtras } from "@/atoms/provider-schools";
import { FilterType } from "@/lib/types/provider/schools";

export function useSchoolFilters(cachedSchools: SchoolWithExtras[]) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const schoolsList = useMemo(() => {
    let filtered =
      activeFilter === "all"
        ? cachedSchools
        : cachedSchools.filter((school) => school.type === activeFilter);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((school) => {
        const nameMatch = school.name?.toLowerCase().includes(query);
        const nicknameMatch = school.nickname?.toLowerCase().includes(query);
        const typeMatch = school.type?.toLowerCase().includes(query);
        const campusesMatch = school.campuses?.some((campus: string) =>
          campus.toLowerCase().includes(query),
        );
        return nameMatch || nicknameMatch || typeMatch || campusesMatch;
      });
    }

    return filtered;
  }, [cachedSchools, activeFilter, searchQuery]);

  return {
    schoolsList,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
  };
}