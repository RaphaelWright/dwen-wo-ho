"use client";

import { useState, useEffect, useMemo } from "react";
import { api } from "@/lib/api";
import { ENDPOINTS } from "@/lib/constants/endpoints";
import { School } from "@/lib/types/school";
import { FilterType } from "@/lib/types/modals";

export const useSchoolSelection = (
  isOpen: boolean,
  onSelect: (school: School | null) => void,
) => {
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  useEffect(() => {
    if (isOpen) {
      loadSchools();
    } else {
      setSearchQuery("");
    }
  }, [isOpen]);

  const loadSchools = async () => {
    setIsLoading(true);
    try {
      const response = await api(ENDPOINTS.schools);
      if (response?.success && response.data) {
        const schoolsList = Array.isArray(response.data) ? response.data : [];
        setSchools(schoolsList);
      }
    } catch (error) {
      // Error loading schools
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSchools = useMemo(() => {
    let filtered =
      activeFilter === "all"
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
