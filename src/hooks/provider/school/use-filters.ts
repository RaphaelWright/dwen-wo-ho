"use client";

import { useState, useMemo } from "react";
import { SchoolWithExtras } from "@/atoms/provider-schools";
import { FilterType } from "@/lib/types/components/provider/schools";
import { filterSchoolsBySearchQuery } from "@/lib/utils/shared/search-query";

export function useSchoolFilters(cachedSchools: SchoolWithExtras[]) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const schoolsList = useMemo(() => {
    let filtered =
      activeFilter === "all"
        ? cachedSchools
        : cachedSchools.filter((school) => school.type === activeFilter);

    if (searchQuery.trim()) {
      filtered = filterSchoolsBySearchQuery(filtered, searchQuery);
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
