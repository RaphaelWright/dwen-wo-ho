"use client";

import { useState, useMemo } from "react";
import useSchoolsQuery from "@/hooks/queries/use-schools";
import { School } from "@/lib/types/entities/school";
import { SchoolPickerFilter } from "@/lib/types/components/shared/overlays";
import { filterSchoolsBySearchQuery } from "@/lib/utils/shared/search-query";

export const useSchoolSelection = (
  isOpen: boolean,
  onSelect: (school: School | null) => void,
) => {
  const { useSchools } = useSchoolsQuery();
  const { data: schools = [], isLoading } = useSchools({ enabled: isOpen });
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<SchoolPickerFilter>("All");

  const filteredSchools = useMemo(() => {
    let filtered =
      activeFilter === "All"
        ? schools
        : schools.filter((school) => school.type === activeFilter);

    if (searchQuery.trim()) {
      filtered = filterSchoolsBySearchQuery(filtered, searchQuery);
    }

    return filtered;
  }, [schools, searchQuery, activeFilter]);

  const handleSchoolClick = (school: School) => {
    onSelect(school);
  };

  const handleSelectPlatform = () => {
    onSelect(null); // null means platform/default
  };

  return {
    schools,
    isLoading,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    filteredSchools,
    handleSchoolClick,
    handleSelectPlatform,
  };
};
