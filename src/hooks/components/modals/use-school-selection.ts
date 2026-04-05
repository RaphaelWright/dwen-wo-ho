"use client";

import { useState, useMemo } from "react";
import useSchoolsQuery from "@/hooks/queries/use-schools";
import { School } from "@/lib/types/school";
import { FilterType } from "@/lib/types/modals";

export const useSchoolSelection = (
  isOpen: boolean,
  onSelect: (school: School | null) => void,
) => {
  const { useSchools } = useSchoolsQuery();
  const { data: schools = [], isLoading } = useSchools({ enabled: isOpen });
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");

  const filteredSchools = useMemo(() => {
    let filtered =
      activeFilter === "All"
        ? schools
        : schools.filter((school) => school.type === activeFilter);

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
